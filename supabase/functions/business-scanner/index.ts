// deno-lint-ignore-file no-explicit-any no-import-prefix
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from 'https://esm.sh/@supabase/supabase-js@2/cors'
import { clientIp, hashIp, normalizeDomain } from '../_shared/audit-utils.ts'
import { resolveTransitionalAuthMode } from '../_shared/public-contracts.ts'

// ── Types ──────────────────────────────────────────────────────────
interface ScanRequest {
  websiteUrl: string
  leadId?: string
  language?: string
}

interface RawEvidence {
  pagespeed?: { mobile?: any; desktop?: any; error?: string }
  observatory?: { scan?: any; error?: string }
  firecrawl?: { scrape?: any; map?: any; error?: string }
  timing: Record<string, number>
}

const UUID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
const LEGACY_SCAN_WINDOW_MS = 60 * 60 * 1000
const LEGACY_SCAN_PER_IP_MAX = 1
const LEGACY_SCAN_GLOBAL_MAX = 10

// ── Helpers ─────────────────────────────────────────────────────────
function normalizeUrl(input: string): string {
  let url = input.trim()
  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `https://${url}`
  }
  return url
}

function hostname(url: string): string {
  try {
    return new URL(url).hostname
  } catch {
    return url.replace(/^https?:\/\//, '').split('/')[0]
  }
}

async function updateProgress(
  supabase: any,
  token: string,
  status: string,
  passed: number,
  total: number,
) {
  await supabase
    .from('analysis_reports')
    .update({ scan_status: status, checks_passed: passed, checks_total: total })
    .eq('token', token)
}

// ── Data Source: Google PageSpeed Insights ──────────────────────────
async function fetchPageSpeed(url: string, strategy: 'mobile' | 'desktop'): Promise<any> {
  const apiKey = Deno.env.get('GOOGLE_PAGESPEED_API_KEY')
  if (!apiKey) throw new Error('GOOGLE_PAGESPEED_API_KEY not configured')

  const params = new URLSearchParams({
    url,
    key: apiKey,
    strategy,
    category: 'performance',
  })
  // Also request accessibility + seo + best-practices
  params.append('category', 'accessibility')
  params.append('category', 'seo')
  params.append('category', 'best-practices')

  const resp = await fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?${params}`, {
    signal: AbortSignal.timeout(30_000),
  })
  if (!resp.ok) {
    const text = await resp.text()
    throw new Error(`PageSpeed ${strategy} error [${resp.status}]: ${text}`)
  }
  return resp.json()
}

async function collectPageSpeed(url: string): Promise<{ mobile?: any; desktop?: any; error?: string }> {
  try {
    const [mobile, desktop] = await Promise.allSettled([
      fetchPageSpeed(url, 'mobile'),
      fetchPageSpeed(url, 'desktop'),
    ])
    return {
      mobile: mobile.status === 'fulfilled' ? mobile.value : { error: String(mobile.reason) },
      desktop: desktop.status === 'fulfilled' ? desktop.value : { error: String(desktop.reason) },
    }
  } catch (err) {
    return { error: `PageSpeed collection failed: ${err}` }
  }
}

// ── Data Source: Mozilla Observatory ────────────────────────────────
async function collectObservatory(host: string): Promise<{ scan?: any; error?: string }> {
  try {
    // Start scan
    const startResp = await fetch(`https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(host)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: 'hidden=true&rescan=true',
      signal: AbortSignal.timeout(10_000),
    })
    
    if (!startResp.ok) {
      // Try GET for cached results
      const cached = await fetch(`https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(host)}`, {
        signal: AbortSignal.timeout(10_000),
      })
      if (cached.ok) return { scan: await cached.json() }
      throw new Error(`Observatory start failed [${startResp.status}]`)
    }

    let scanData = await startResp.json()
    
    // Poll if still running (max 6 attempts, 5s apart)
    for (let i = 0; i < 6 && scanData.state === 'RUNNING'; i++) {
      await new Promise(r => setTimeout(r, 5000))
      const pollResp = await fetch(
        `https://observatory-api.mdn.mozilla.net/api/v2/scan?host=${encodeURIComponent(host)}`,
        { signal: AbortSignal.timeout(10_000) }
      )
      if (pollResp.ok) scanData = await pollResp.json()
    }

    return { scan: scanData }
  } catch (err) {
    return { error: `Observatory failed: ${err}` }
  }
}

// ── Data Source: Firecrawl ──────────────────────────────────────────
async function collectFirecrawl(url: string): Promise<{ scrape?: any; map?: any; error?: string }> {
  const apiKey = Deno.env.get('FIRECRAWL_API_KEY')
  if (!apiKey) return { error: 'FIRECRAWL_API_KEY not configured' }

  const headers = {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
  }

  try {
    const [scrapeResult, mapResult] = await Promise.allSettled([
      // Scrape main page
      fetch('https://api.firecrawl.dev/v2/scrape', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url,
          formats: ['markdown', 'links'],
          onlyMainContent: false,
          waitFor: 3000,
        }),
        signal: AbortSignal.timeout(30_000),
      }).then(async r => {
        if (!r.ok) throw new Error(`Scrape failed [${r.status}]: ${await r.text()}`)
        return r.json()
      }),
      // Map site structure
      fetch('https://api.firecrawl.dev/v2/map', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          url,
          limit: 100,
          includeSubdomains: false,
        }),
        signal: AbortSignal.timeout(15_000),
      }).then(async r => {
        if (!r.ok) throw new Error(`Map failed [${r.status}]: ${await r.text()}`)
        return r.json()
      }),
    ])

    return {
      scrape: scrapeResult.status === 'fulfilled' ? scrapeResult.value : { error: String(scrapeResult.reason) },
      map: mapResult.status === 'fulfilled' ? mapResult.value : { error: String(mapResult.reason) },
    }
  } catch (err) {
    return { error: `Firecrawl collection failed: ${err}` }
  }
}

// ── Main Handler ───────────────────────────────────────────────────
Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  const legacyPublicEnabled =
    Deno.env.get('LEGACY_PUBLIC_SCANNER_ENABLED') === 'true'
  const authMode = serviceKey
    ? resolveTransitionalAuthMode(
      req.headers.get('authorization'),
      req.headers.get('apikey'),
      {
        serviceKey,
        publicKeys: [
          Deno.env.get('SUPABASE_ANON_KEY'),
          Deno.env.get('SUPABASE_PUBLISHABLE_KEY'),
        ],
        legacyPublicEnabled,
      },
    )
    : null
  if (!serviceKey || !authMode) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const t0 = Date.now()

  try {
    const body: ScanRequest = await req.json()
    const { websiteUrl, leadId, language } = body

    if (!websiteUrl || typeof websiteUrl !== 'string') {
      return new Response(JSON.stringify({ error: 'websiteUrl is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const url = normalizeUrl(websiteUrl)
    const host = hostname(url)

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      serviceKey,
    )

    let token: string

    if (authMode === 'legacy_public') {
      if (!leadId || !UUID_PATTERN.test(leadId)) {
        return new Response(JSON.stringify({ error: 'eligible lead is required' }), {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const normalizedWebsite = normalizeDomain(websiteUrl)
      if ('error' in normalizedWebsite) {
        return new Response(JSON.stringify({ error: 'websiteUrl is invalid' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      const ipHash = await hashIp(clientIp(req))
      if (!ipHash) {
        return new Response(JSON.stringify({ error: 'scan guard unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      const { data: claimRows, error: claimError } = await supabase.rpc(
        'claim_legacy_analysis_scan',
        {
          p_lead_id: leadId,
          p_normalized_domain: normalizedWebsite.domain,
          p_site_name: normalizedWebsite.domain,
          p_language: language === 'en' ? 'en' : 'de',
          p_ip_hash: ipHash,
          p_per_ip_limit: LEGACY_SCAN_PER_IP_MAX,
          p_global_limit: LEGACY_SCAN_GLOBAL_MAX,
        },
      )
      const claim = Array.isArray(claimRows) ? claimRows[0] : null
      if (claimError) {
        console.error('Legacy scan claim failed:', claimError)
        return new Response(JSON.stringify({ error: 'scan guard unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
      if (claim?.deny_reason) {
        const rateLimited = claim.deny_reason === 'per_ip_hourly_exceeded' ||
          claim.deny_reason === 'global_hourly_exceeded'
        return new Response(
          JSON.stringify({
            error: rateLimited
              ? 'scan rate limit reached'
              : 'eligible lead is required',
          }),
          {
            status: rateLimited ? 429 : 403,
            headers: {
              ...corsHeaders,
              'Content-Type': 'application/json',
              ...(rateLimited
                ? { 'Retry-After': String(LEGACY_SCAN_WINDOW_MS / 1000) }
                : {}),
            },
          },
        )
      }
      if (!claim?.scan_token) {
        return new Response(JSON.stringify({ error: 'scan guard unavailable' }), {
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }

      token = claim.scan_token
      if (claim.scan_reused) {
        return new Response(
          JSON.stringify({ success: true, token, reused: true }),
          {
            status: 200,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          },
        )
      }
    } else {
      token = crypto.randomUUID()
      const { error: insertError } = await supabase
        .from('analysis_reports')
        .insert({
          token,
          site_name: host,
          lead_id: leadId || null,
          scan_status: 'collecting',
          language: language || 'de',
          checks_passed: 0,
          checks_total: 3,
          scan_version: 'v1.0-evidence',
          data_sources_used: [],
        })

      if (insertError) {
        console.error('Insert error:', insertError)
        return new Response(JSON.stringify({ error: 'Failed to create scan' }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        })
      }
    }

    const totalChecks = 3 // pagespeed, observatory, firecrawl

    // Return token immediately, then continue processing in background
    const responsePromise = new Response(JSON.stringify({ success: true, token }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })

    // Background: collect evidence from all 3 sources
    // We use waitUntil-style processing via EdgeRuntime
    const evidence: RawEvidence = { timing: {} }
    const dataSources: string[] = []
    let checksCompleted = 0

    // Run all 3 collectors in parallel
    await Promise.allSettled([
      (async () => {
        const t = Date.now()
        const result = await collectPageSpeed(url)
        evidence.timing.pagespeed_ms = Date.now() - t
        evidence.pagespeed = result
        if (!result.error) dataSources.push('pagespeed')
        checksCompleted++
        await updateProgress(supabase, token, 'collecting', checksCompleted, totalChecks)
        return result
      })(),
      (async () => {
        const t = Date.now()
        const result = await collectObservatory(host)
        evidence.timing.observatory_ms = Date.now() - t
        evidence.observatory = result
        if (!result.error) dataSources.push('observatory')
        checksCompleted++
        await updateProgress(supabase, token, 'collecting', checksCompleted, totalChecks)
        return result
      })(),
      (async () => {
        const t = Date.now()
        const result = await collectFirecrawl(url)
        evidence.timing.firecrawl_ms = Date.now() - t
        evidence.firecrawl = result
        if (!result.error) dataSources.push('firecrawl')
        checksCompleted++
        await updateProgress(supabase, token, 'collecting', checksCompleted, totalChecks)
        return result
      })(),
    ])

    const scanDuration = Date.now() - t0
    evidence.timing.total_ms = scanDuration

    // Store raw evidence
    const finalStatus = dataSources.length === 0 ? 'error' : 'evidence_collected'

    const { error: updateError } = await supabase
      .from('analysis_reports')
      .update({
        raw_evidence: evidence,
        data_sources_used: dataSources,
        scan_status: finalStatus,
        scan_duration_ms: scanDuration,
        checks_passed: dataSources.length,
        checks_total: totalChecks,
      })
      .eq('token', token)

    if (updateError) {
      console.error('Update error:', updateError)
    }

    console.log(`Evidence collected: ${host} | ${dataSources.length}/${totalChecks} sources | ${scanDuration}ms`)

    // Chain: auto-call normalize-and-score if evidence was collected
    if (dataSources.length > 0) {
      try {
        const scoreResp = await fetch(
          `${Deno.env.get('SUPABASE_URL')}/functions/v1/normalize-and-score`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
            },
            body: JSON.stringify({ token }),
            signal: AbortSignal.timeout(15_000),
          }
        )
        if (scoreResp.ok) {
          const scoreData = await scoreResp.json()
          console.log(`Scored: ${scoreData.overall_score}/100, ${scoreData.signal_count} signals`)

          // Chain: auto-call AI interpretation
          try {
            const aiResp = await fetch(
              `${Deno.env.get('SUPABASE_URL')}/functions/v1/ai-interpret`,
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
                },
                body: JSON.stringify({ token }),
                signal: AbortSignal.timeout(30_000),
              }
            )
            if (aiResp.ok) {
              console.log(`AI interpretation complete for ${token}`)
            } else {
              console.error(`AI interpret failed: ${aiResp.status}`)
              await aiResp.text() // consume body
            }
          } catch (aiErr) {
            console.error('AI interpretation error (non-fatal):', aiErr)
          }
        } else {
          console.error(`Scoring failed: ${scoreResp.status}`)
          await scoreResp.text()
        }
      } catch (scoreErr) {
        console.error('Scoring chain error (non-fatal):', scoreErr)
      }
    }

    return responsePromise
  } catch (err) {
    console.error('Scanner error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})

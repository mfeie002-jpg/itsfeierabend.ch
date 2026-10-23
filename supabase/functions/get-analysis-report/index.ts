// deno-lint-ignore-file no-import-prefix
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { acceptsTransitionalInternalAuth } from "../_shared/public-contracts.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-report-token',
};
const privateHeaders = {
  ...corsHeaders,
  'Content-Type': 'application/json',
  'Cache-Control': 'private, no-store',
  'Pragma': 'no-cache',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'method_not_allowed' }), {
      status: 405,
      headers: privateHeaders,
    });
  }

  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  const legacyPublicEnabled =
    Deno.env.get('LEGACY_PUBLIC_SCANNER_ENABLED') === 'true';
  if (
    !supabaseServiceKey ||
    !acceptsTransitionalInternalAuth(
      req.headers.get('authorization'),
      req.headers.get('apikey'),
      {
        serviceKey: supabaseServiceKey,
        publicKeys: [
          Deno.env.get('SUPABASE_ANON_KEY'),
          Deno.env.get('SUPABASE_PUBLISHABLE_KEY'),
        ],
        legacyPublicEnabled,
      },
    )
  ) {
    return new Response(JSON.stringify({ error: 'unauthorized' }), {
      status: 401,
      headers: privateHeaders,
    });
  }

  try {
    const { token } = await req.json();
    
    if (!token) {
      console.error('No token provided');
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: privateHeaders }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the analysis report
    const { data: report, error: reportError } = await supabase
      .from('analysis_reports')
      .select('site_name, overall_score, critical_issues, warning_issues, info_issues, normalized_signals, scoring_details, ai_interpretation, scan_status, scan_duration_ms, data_sources_used, scan_version, created_at, checks_passed, checks_total')
      .eq('token', token)
      .maybeSingle();

    if (reportError) {
      console.error('Error fetching report:', reportError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch report' }),
        { status: 500, headers: privateHeaders }
      );
    }

    if (!report) {
      console.log('Analysis report not found');
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: privateHeaders }
      );
    }

    // Update viewed_at timestamp
    await supabase
      .from('analysis_reports')
      .update({ viewed_at: new Date().toISOString() })
      .eq('token', token);

    const safeSignal = (signal: Record<string, unknown>) => ({
      id: signal.id,
      category: signal.category,
      label: signal.label,
      value: signal.value,
      score: signal.score,
      confidence: signal.confidence,
      source: signal.source,
    });
    const scoring = report.scoring_details as {
      categories?: Array<Record<string, unknown> & { signals?: Record<string, unknown>[] }>;
      overall?: number;
    } | null;
    const safeScoring = scoring ? {
      overall: scoring.overall,
      categories: (scoring.categories || []).map((category) => ({
        id: category.id,
        name: category.name,
        weight: category.weight,
        score: category.score,
        issueCount: category.issueCount,
        criticalCount: category.criticalCount,
        signals: (category.signals || []).map(safeSignal),
      })),
    } : null;
    const safeReport = {
      ...report,
      normalized_signals: Array.isArray(report.normalized_signals)
        ? report.normalized_signals.map(safeSignal)
        : [],
      scoring_details: safeScoring,
    };

    return new Response(
      JSON.stringify({ report: safeReport }),
      { status: 200, headers: privateHeaders }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: privateHeaders }
    );
  }
});

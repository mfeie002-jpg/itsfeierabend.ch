import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-report-token',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } },
    );
  }

  try {
    const { token } = await req.json();
    
    if (typeof token !== 'string' || !/^[0-9a-f-]{36}$/i.test(token)) {
      return new Response(
        JSON.stringify({ error: 'Token is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch the analysis report
    const { data: report, error: reportError } = await supabase
      .from('analysis_reports')
      .select([
        'ai_interpretation', 'categories', 'checks_passed', 'checks_total',
        'consequences', 'created_at', 'critical_issues', 'current_revenue',
        'data_sources_used', 'hourly_rate', 'info_issues', 'language',
        'monthly_loss', 'normalized_signals', 'overall_score',
        'projected_revenue', 'scan_duration_ms', 'scan_status', 'scan_version',
        'scoring_details', 'site_name', 'total_hours', 'total_issues',
        'viewed_at', 'warning_issues',
      ].join(','))
      .eq('token', token)
      .maybeSingle();

    if (reportError) {
      console.error('Error fetching report:', reportError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch report' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!report) {
      console.log('Analysis report not found');
      return new Response(
        JSON.stringify({ error: 'Report not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Update viewed_at timestamp
    await supabase
      .from('analysis_reports')
      .update({ viewed_at: new Date().toISOString() })
      .eq('token', token);

    console.log('Report found:', report.site_name);

    return new Response(
      JSON.stringify({ report }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

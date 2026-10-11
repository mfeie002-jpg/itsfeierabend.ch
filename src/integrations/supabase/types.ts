export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      analysis_reports: {
        Row: {
          ai_interpretation: Json | null
          categories: Json
          checks_passed: number | null
          checks_total: number | null
          consequences: Json
          created_at: string
          critical_issues: number
          current_revenue: number
          data_sources_used: string[] | null
          hourly_rate: number
          id: string
          info_issues: number
          language: string | null
          lead_id: string | null
          monthly_loss: number
          normalized_signals: Json | null
          overall_score: number
          projected_revenue: number
          raw_evidence: Json | null
          scan_duration_ms: number | null
          scan_status: string
          scan_version: string | null
          scoring_details: Json | null
          site_name: string
          token: string
          total_hours: number
          total_issues: number
          viewed_at: string | null
          warning_issues: number
        }
        Insert: {
          ai_interpretation?: Json | null
          categories?: Json
          checks_passed?: number | null
          checks_total?: number | null
          consequences?: Json
          created_at?: string
          critical_issues?: number
          current_revenue?: number
          data_sources_used?: string[] | null
          hourly_rate?: number
          id?: string
          info_issues?: number
          language?: string | null
          lead_id?: string | null
          monthly_loss?: number
          normalized_signals?: Json | null
          overall_score?: number
          projected_revenue?: number
          raw_evidence?: Json | null
          scan_duration_ms?: number | null
          scan_status?: string
          scan_version?: string | null
          scoring_details?: Json | null
          site_name: string
          token: string
          total_hours?: number
          total_issues?: number
          viewed_at?: string | null
          warning_issues?: number
        }
        Update: {
          ai_interpretation?: Json | null
          categories?: Json
          checks_passed?: number | null
          checks_total?: number | null
          consequences?: Json
          created_at?: string
          critical_issues?: number
          current_revenue?: number
          data_sources_used?: string[] | null
          hourly_rate?: number
          id?: string
          info_issues?: number
          language?: string | null
          lead_id?: string | null
          monthly_loss?: number
          normalized_signals?: Json | null
          overall_score?: number
          projected_revenue?: number
          raw_evidence?: Json | null
          scan_duration_ms?: number | null
          scan_status?: string
          scan_version?: string | null
          scoring_details?: Json | null
          site_name?: string
          token?: string
          total_hours?: number
          total_issues?: number
          viewed_at?: string | null
          warning_issues?: number
        }
        Relationships: [
          {
            foreignKeyName: "analysis_reports_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_events: {
        Row: {
          audit_id: string | null
          created_at: string
          event_type: string
          id: string
          ip_hash: string | null
          metadata: Json | null
          user_agent: string | null
        }
        Insert: {
          audit_id?: string | null
          created_at?: string
          event_type: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Update: {
          audit_id?: string | null
          created_at?: string
          event_type?: string
          id?: string
          ip_hash?: string | null
          metadata?: Json | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_events_audit_id_fkey"
            columns: ["audit_id"]
            isOneToOne: false
            referencedRelation: "audit_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_requests: {
        Row: {
          category_scores: Json | null
          completed_at: string | null
          consent_marketing: boolean
          consent_processing: boolean
          created_at: string
          cta_clicked_at: string | null
          email: string
          email_sent_at: string | null
          error: string | null
          fetch_meta: Json | null
          first_name: string
          id: string
          ip_hash: string | null
          language: string
          last_name: string
          normalized_domain: string
          overall_score: number | null
          report_viewed_at: string | null
          score_version: string | null
          semrush_calls: Json | null
          semrush_data: Json | null
          semrush_fetched_at: string | null
          semrush_status: string | null
          signals: Json | null
          status: string
          token: string
          top_actions: Json | null
          updated_at: string
          user_agent: string | null
          website_url: string
        }
        Insert: {
          category_scores?: Json | null
          completed_at?: string | null
          consent_marketing?: boolean
          consent_processing?: boolean
          created_at?: string
          cta_clicked_at?: string | null
          email: string
          email_sent_at?: string | null
          error?: string | null
          fetch_meta?: Json | null
          first_name: string
          id?: string
          ip_hash?: string | null
          language?: string
          last_name: string
          normalized_domain: string
          overall_score?: number | null
          report_viewed_at?: string | null
          score_version?: string | null
          semrush_calls?: Json | null
          semrush_data?: Json | null
          semrush_fetched_at?: string | null
          semrush_status?: string | null
          signals?: Json | null
          status?: string
          token?: string
          top_actions?: Json | null
          updated_at?: string
          user_agent?: string | null
          website_url: string
        }
        Update: {
          category_scores?: Json | null
          completed_at?: string | null
          consent_marketing?: boolean
          consent_processing?: boolean
          created_at?: string
          cta_clicked_at?: string | null
          email?: string
          email_sent_at?: string | null
          error?: string | null
          fetch_meta?: Json | null
          first_name?: string
          id?: string
          ip_hash?: string | null
          language?: string
          last_name?: string
          normalized_domain?: string
          overall_score?: number | null
          report_viewed_at?: string | null
          score_version?: string | null
          semrush_calls?: Json | null
          semrush_data?: Json | null
          semrush_fetched_at?: string | null
          semrush_status?: string | null
          signals?: Json | null
          status?: string
          token?: string
          top_actions?: Json | null
          updated_at?: string
          user_agent?: string | null
          website_url?: string
        }
        Relationships: []
      }
      callback_requests: {
        Row: {
          consent_ai_call: boolean | null
          consent_recording: boolean | null
          created_at: string
          error: string | null
          id: string
          language: string
          lead_id: string | null
          phone: string
          preferred_time: string | null
          report_token: string | null
          retell_call_id: string | null
          status: string
        }
        Insert: {
          consent_ai_call?: boolean | null
          consent_recording?: boolean | null
          created_at?: string
          error?: string | null
          id?: string
          language: string
          lead_id?: string | null
          phone: string
          preferred_time?: string | null
          report_token?: string | null
          retell_call_id?: string | null
          status?: string
        }
        Update: {
          consent_ai_call?: boolean | null
          consent_recording?: boolean | null
          created_at?: string
          error?: string | null
          id?: string
          language?: string
          lead_id?: string | null
          phone?: string
          preferred_time?: string | null
          report_token?: string | null
          retell_call_id?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "callback_requests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      calls: {
        Row: {
          agent_id: string | null
          call_analysis: Json | null
          consent_recording: boolean | null
          consent_transcript: boolean | null
          created_at: string
          data_storage_setting: string | null
          direction: string | null
          disconnection_reason: string | null
          duration_ms: number | null
          end_timestamp: number | null
          from_number: string | null
          id: string
          lead_id: string | null
          metadata: Json | null
          public_log_url: string | null
          recording_multi_channel_url: string | null
          recording_url: string | null
          retell_call_id: string
          start_timestamp: number | null
          status: string | null
          to_number: string | null
          transcript: string | null
          transcript_object: Json | null
          transcript_with_tool_calls: Json | null
          transfer_destination: string | null
          updated_at: string
        }
        Insert: {
          agent_id?: string | null
          call_analysis?: Json | null
          consent_recording?: boolean | null
          consent_transcript?: boolean | null
          created_at?: string
          data_storage_setting?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: number | null
          from_number?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          recording_url?: string | null
          retell_call_id: string
          start_timestamp?: number | null
          status?: string | null
          to_number?: string | null
          transcript?: string | null
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
          transfer_destination?: string | null
          updated_at?: string
        }
        Update: {
          agent_id?: string | null
          call_analysis?: Json | null
          consent_recording?: boolean | null
          consent_transcript?: boolean | null
          created_at?: string
          data_storage_setting?: string | null
          direction?: string | null
          disconnection_reason?: string | null
          duration_ms?: number | null
          end_timestamp?: number | null
          from_number?: string | null
          id?: string
          lead_id?: string | null
          metadata?: Json | null
          public_log_url?: string | null
          recording_multi_channel_url?: string | null
          recording_url?: string | null
          retell_call_id?: string
          start_timestamp?: number | null
          status?: string | null
          to_number?: string | null
          transcript?: string | null
          transcript_object?: Json | null
          transcript_with_tool_calls?: Json | null
          transfer_destination?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "calls_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      do_not_call: {
        Row: {
          created_at: string
          id: string
          phone: string
          reason: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          phone: string
          reason?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string
          reason?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          budget_range: string | null
          capacity_range: string | null
          created_at: string
          duplicate_of: string | null
          email: string
          gclid: string | null
          id: string
          industry: string
          ip_hash: string | null
          is_duplicate: boolean | null
          language: string
          lead_type: string
          message: string | null
          name: string
          notes_internal: string | null
          phone: string | null
          pre_score_bucket: string | null
          pre_score_total: number | null
          preferred_times: string | null
          public_token: string | null
          referrer: string | null
          service_area: string
          status: string
          user_agent: string | null
          utm_campaign: string | null
          utm_content: string | null
          utm_medium: string | null
          utm_source: string | null
          utm_term: string | null
          website_url: string | null
        }
        Insert: {
          budget_range?: string | null
          capacity_range?: string | null
          created_at?: string
          duplicate_of?: string | null
          email: string
          gclid?: string | null
          id?: string
          industry: string
          ip_hash?: string | null
          is_duplicate?: boolean | null
          language: string
          lead_type: string
          message?: string | null
          name: string
          notes_internal?: string | null
          phone?: string | null
          pre_score_bucket?: string | null
          pre_score_total?: number | null
          preferred_times?: string | null
          public_token?: string | null
          referrer?: string | null
          service_area: string
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website_url?: string | null
        }
        Update: {
          budget_range?: string | null
          capacity_range?: string | null
          created_at?: string
          duplicate_of?: string | null
          email?: string
          gclid?: string | null
          id?: string
          industry?: string
          ip_hash?: string | null
          is_duplicate?: boolean | null
          language?: string
          lead_type?: string
          message?: string | null
          name?: string
          notes_internal?: string | null
          phone?: string | null
          pre_score_bucket?: string | null
          pre_score_total?: number | null
          preferred_times?: string | null
          public_token?: string | null
          referrer?: string | null
          service_area?: string
          status?: string
          user_agent?: string | null
          utm_campaign?: string | null
          utm_content?: string | null
          utm_medium?: string | null
          utm_source?: string | null
          utm_term?: string | null
          website_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leads_duplicate_of_fkey"
            columns: ["duplicate_of"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      rate_limits: {
        Row: {
          created_at: string
          id: string
          ip_hash: string
          scope: string
        }
        Insert: {
          created_at?: string
          id?: string
          ip_hash: string
          scope?: string
        }
        Update: {
          created_at?: string
          id?: string
          ip_hash?: string
          scope?: string
        }
        Relationships: []
      }
      semrush_daily_usage: {
        Row: {
          cached_hits: number
          day: string
          fresh_domains: number
          updated_at: string
        }
        Insert: {
          cached_hits?: number
          day: string
          fresh_domains?: number
          updated_at?: string
        }
        Update: {
          cached_hits?: number
          day?: string
          fresh_domains?: number
          updated_at?: string
        }
        Relationships: []
      }
      semrush_domain_cache: {
        Row: {
          calls: Json
          created_at: string
          data: Json
          fetched_at: string
          normalized_domain: string
          status: string
          updated_at: string
        }
        Insert: {
          calls?: Json
          created_at?: string
          data: Json
          fetched_at?: string
          normalized_domain: string
          status: string
          updated_at?: string
        }
        Update: {
          calls?: Json
          created_at?: string
          data?: Json
          fetched_at?: string
          normalized_domain?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const

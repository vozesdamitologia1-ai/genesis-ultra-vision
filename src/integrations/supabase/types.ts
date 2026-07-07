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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      ai_settings: {
        Row: {
          id: string
          persona_name: string | null
          system_prompt: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          persona_name?: string | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          persona_name?: string | null
          system_prompt?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      bible_api_cache: {
        Row: {
          book_name: string | null
          chapter: number | null
          created_at: string | null
          full_text: string | null
          id: string
          reference_key: string | null
          verse_number: string | null
        }
        Insert: {
          book_name?: string | null
          chapter?: number | null
          created_at?: string | null
          full_text?: string | null
          id?: string
          reference_key?: string | null
          verse_number?: string | null
        }
        Update: {
          book_name?: string | null
          chapter?: number | null
          created_at?: string | null
          full_text?: string | null
          id?: string
          reference_key?: string | null
          verse_number?: string | null
        }
        Relationships: []
      }
      bible_insights: {
        Row: {
          id: string
          original_languages: string | null
          path_type: string | null
          reference: string
          theological_context: string | null
        }
        Insert: {
          id?: string
          original_languages?: string | null
          path_type?: string | null
          reference: string
          theological_context?: string | null
        }
        Update: {
          id?: string
          original_languages?: string | null
          path_type?: string | null
          reference?: string
          theological_context?: string | null
        }
        Relationships: []
      }
      bible_verses: {
        Row: {
          book: string
          chapter: number
          content: string
          id: string
          path_type: string | null
          verse: number
          version: string | null
        }
        Insert: {
          book: string
          chapter: number
          content: string
          id?: string
          path_type?: string | null
          verse: number
          version?: string | null
        }
        Update: {
          book?: string
          chapter?: number
          content?: string
          id?: string
          path_type?: string | null
          verse?: number
          version?: string | null
        }
        Relationships: []
      }
      campaigns: {
        Row: {
          city: string
          country_code: string | null
          created_at: string | null
          description: string | null
          goal_amount: number
          id: string
          path_type: string | null
          project_type: string | null
          raised_amount: number | null
          state: string
          title: string
        }
        Insert: {
          city: string
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          goal_amount: number
          id?: string
          path_type?: string | null
          project_type?: string | null
          raised_amount?: number | null
          state: string
          title: string
        }
        Update: {
          city?: string
          country_code?: string | null
          created_at?: string | null
          description?: string | null
          goal_amount?: number
          id?: string
          path_type?: string | null
          project_type?: string | null
          raised_amount?: number | null
          state?: string
          title?: string
        }
        Relationships: []
      }
      cells: {
        Row: {
          id: string
          is_live: boolean | null
          language: string | null
          live_url: string | null
          mentor_type: string | null
          name: string
          starts_at: string | null
        }
        Insert: {
          id?: string
          is_live?: boolean | null
          language?: string | null
          live_url?: string | null
          mentor_type?: string | null
          name: string
          starts_at?: string | null
        }
        Update: {
          id?: string
          is_live?: boolean | null
          language?: string | null
          live_url?: string | null
          mentor_type?: string | null
          name?: string
          starts_at?: string | null
        }
        Relationships: []
      }
      community_messages: {
        Row: {
          content: string | null
          created_at: string | null
          id: string
          likes: string[]
          parent_id: string | null
          path_type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          likes?: string[]
          parent_id?: string | null
          path_type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          likes?: string[]
          parent_id?: string | null
          path_type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "community_messages_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "community_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      contents: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          id: string
          is_reel: boolean | null
          is_vip: boolean | null
          path_type: string
          thumbnail_url: string | null
          title: string
          video_url: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_reel?: boolean | null
          is_vip?: boolean | null
          path_type: string
          thumbnail_url?: string | null
          title: string
          video_url?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          is_reel?: boolean | null
          is_vip?: boolean | null
          path_type?: string
          thumbnail_url?: string | null
          title?: string
          video_url?: string | null
        }
        Relationships: []
      }
      groups: {
        Row: {
          id: string
          leader: string | null
          link_join: string | null
          meeting_day: string | null
          meeting_time: string | null
          name: string
          path_type: string | null
        }
        Insert: {
          id?: string
          leader?: string | null
          link_join?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name: string
          path_type?: string | null
        }
        Update: {
          id?: string
          leader?: string | null
          link_join?: string | null
          meeting_day?: string | null
          meeting_time?: string | null
          name?: string
          path_type?: string | null
        }
        Relationships: []
      }
      help_requests: {
        Row: {
          created_at: string | null
          id: string
          message: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      mentorship_logs: {
        Row: {
          ai_response: string | null
          created_at: string | null
          id: string
          path_type: string | null
          user_id: string | null
          user_query: string | null
        }
        Insert: {
          ai_response?: string | null
          created_at?: string | null
          id?: string
          path_type?: string | null
          user_id?: string | null
          user_query?: string | null
        }
        Update: {
          ai_response?: string | null
          created_at?: string | null
          id?: string
          path_type?: string | null
          user_id?: string | null
          user_query?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          access_level: string | null
          avatar_url: string | null
          current_mode: string | null
          email: string | null
          full_name: string | null
          id: string
          language: string | null
          last_checkin: string | null
          preferred_language: string | null
          selected_path: string | null
          updated_at: string | null
          user_country: string | null
        }
        Insert: {
          access_level?: string | null
          avatar_url?: string | null
          current_mode?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          last_checkin?: string | null
          preferred_language?: string | null
          selected_path?: string | null
          updated_at?: string | null
          user_country?: string | null
        }
        Update: {
          access_level?: string | null
          avatar_url?: string | null
          current_mode?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_checkin?: string | null
          preferred_language?: string | null
          selected_path?: string | null
          updated_at?: string | null
          user_country?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const

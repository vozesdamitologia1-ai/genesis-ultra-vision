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
          path_type: string | null
          user_id: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: string
          path_type?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: string
          path_type?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      contents: {
        Row: {
          category: string | null
          content_url: string | null
          created_at: string
          description: string | null
          id: string
          language: string | null
          path_type: string | null
          thumbnail_url: string | null
          title: string
          type: string | null
        }
        Insert: {
          category?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          path_type?: string | null
          thumbnail_url?: string | null
          title: string
          type?: string | null
        }
        Update: {
          category?: string | null
          content_url?: string | null
          created_at?: string
          description?: string | null
          id?: string
          language?: string | null
          path_type?: string | null
          thumbnail_url?: string | null
          title?: string
          type?: string | null
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
          full_name: string | null
          id: string
          language: string | null
          last_checkin: string | null
          preferred_language: string | null
          selected_path: string | null
          updated_at: string | null
        }
        Insert: {
          access_level?: string | null
          avatar_url?: string | null
          current_mode?: string | null
          full_name?: string | null
          id: string
          language?: string | null
          last_checkin?: string | null
          preferred_language?: string | null
          selected_path?: string | null
          updated_at?: string | null
        }
        Update: {
          access_level?: string | null
          avatar_url?: string | null
          current_mode?: string | null
          full_name?: string | null
          id?: string
          language?: string | null
          last_checkin?: string | null
          preferred_language?: string | null
          selected_path?: string | null
          updated_at?: string | null
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

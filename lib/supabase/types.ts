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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          barrio: string | null
          consent_accepted: boolean | null
          consent_timestamp: string | null
          created_at: string | null
          departamento: string | null
          dni: string | null
          email: string | null
          full_name: string | null
          id: string
          localidad: string | null
          localidad_tipo: string | null
          phone: string | null
          profile_complete: boolean | null
          sexo: string | null
        }
        Insert: {
          barrio?: string | null
          consent_accepted?: boolean | null
          consent_timestamp?: string | null
          created_at?: string | null
          departamento?: string | null
          dni?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          localidad?: string | null
          localidad_tipo?: string | null
          phone?: string | null
          profile_complete?: boolean | null
          sexo?: string | null
        }
        Update: {
          barrio?: string | null
          consent_accepted?: boolean | null
          consent_timestamp?: string | null
          created_at?: string | null
          departamento?: string | null
          dni?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          localidad?: string | null
          localidad_tipo?: string | null
          phone?: string | null
          profile_complete?: boolean | null
          sexo?: string | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          active: boolean | null
          area: string | null
          created_at: string | null
          id: string
          role: string | null
          user_id: string
        }
        Insert: {
          active?: boolean | null
          area?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id: string
        }
        Update: {
          active?: boolean | null
          area?: string | null
          created_at?: string | null
          id?: string
          role?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          id: string
          storage_path: string
          ticket_id: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          id?: string
          storage_path: string
          ticket_id: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          id?: string
          storage_path?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_attachments_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_events: {
        Row: {
          author_id: string | null
          content: string | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          new_priority: string | null
          new_status: string | null
          old_priority: string | null
          old_status: string | null
          ticket_id: string
          type: string
        }
        Insert: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          new_priority?: string | null
          new_status?: string | null
          old_priority?: string | null
          old_status?: string | null
          ticket_id: string
          type: string
        }
        Update: {
          author_id?: string | null
          content?: string | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          new_priority?: string | null
          new_status?: string | null
          old_priority?: string | null
          old_status?: string | null
          ticket_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_events_author_id_fkey"
            columns: ["author_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_events_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      ticket_likes: {
        Row: {
          citizen_id: string
          created_at: string | null
          id: string
          ticket_id: string
        }
        Insert: {
          citizen_id: string
          created_at?: string | null
          id?: string
          ticket_id: string
        }
        Update: {
          citizen_id?: string
          created_at?: string | null
          id?: string
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_likes_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ticket_likes_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          area: string | null
          assigned_to: string | null
          category: string
          citizen_id: string
          contact_dni: string | null
          contact_email: string | null
          contact_name: string | null
          contact_phone: string | null
          created_at: string | null
          description: string
          id: string
          is_public: boolean | null
          likes_count: number | null
          localidad: string | null
          priority: string | null
          // Valores válidos (CHECK constraint en DB): 'nuevo' | 'en_revision' | 'en_gestion' |
          // 'derivado' | 'requiere_info' | 'resuelto' | 'cerrado'. 'cerrado' se agregó a mano
          // acá — lo habilita MIGRACION_ESTADO_CERRADO.sql; regenerar los tipos al correrla.
          status: string | null
          // Agregado a mano: la columna la crea MIGRACION_TICKET_NUMBER.sql, que
          // todavía no se corrió. Nullable mientras tanto — el UI cae al UUID corto.
          ticket_number: number | null
          title: string
          type: string
          updated_at: string | null
        }
        Insert: {
          area?: string | null
          assigned_to?: string | null
          category: string
          citizen_id: string
          contact_dni?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          localidad?: string | null
          priority?: string | null
          status?: string | null
          ticket_number?: number | null
          title: string
          type: string
          updated_at?: string | null
        }
        Update: {
          area?: string | null
          assigned_to?: string | null
          category?: string
          citizen_id?: string
          contact_dni?: string | null
          contact_email?: string | null
          contact_name?: string | null
          contact_phone?: string | null
          created_at?: string | null
          description?: string
          id?: string
          is_public?: boolean | null
          likes_count?: number | null
          localidad?: string | null
          priority?: string | null
          status?: string | null
          ticket_number?: number | null
          title?: string
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "team_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_citizen_id_fkey"
            columns: ["citizen_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_tickets_stats: {
        Row: {
          area: string | null
          category: string | null
          created_at: string | null
          month: string | null
          priority: string | null
          status: string | null
        }
        Insert: {
          area?: string | null
          category?: string | null
          created_at?: string | null
          month?: never
          priority?: string | null
          status?: string | null
        }
        Update: {
          area?: string | null
          category?: string | null
          created_at?: string | null
          month?: never
          priority?: string | null
          status?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      is_active_team_member: { Args: never; Returns: boolean }
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

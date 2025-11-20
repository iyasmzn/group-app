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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      group_asset_maintenance: {
        Row: {
          asset_id: string | null
          cost: number | null
          description: string
          id: string
          performed_at: string | null
          performed_by: string | null
        }
        Insert: {
          asset_id?: string | null
          cost?: number | null
          description: string
          id?: string
          performed_at?: string | null
          performed_by?: string | null
        }
        Update: {
          asset_id?: string | null
          cost?: number | null
          description?: string
          id?: string
          performed_at?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_asset_maintenance_asset_id_fkey"
            columns: ["asset_id"]
            isOneToOne: false
            referencedRelation: "group_assets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_asset_maintenance_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_assets: {
        Row: {
          acquired_at: string | null
          group_id: string | null
          id: string
          name: string
          notes: string | null
          status: string | null
          type: string | null
          value: number | null
        }
        Insert: {
          acquired_at?: string | null
          group_id?: string | null
          id?: string
          name: string
          notes?: string | null
          status?: string | null
          type?: string | null
          value?: number | null
        }
        Update: {
          acquired_at?: string | null
          group_id?: string | null
          id?: string
          name?: string
          notes?: string | null
          status?: string | null
          type?: string | null
          value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_assets_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_balances: {
        Row: {
          balance: number
          group_id: string
          updated_at: string | null
        }
        Insert: {
          balance?: number
          group_id: string
          updated_at?: string | null
        }
        Update: {
          balance?: number
          group_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_balances_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_coop_ledger: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          entry_type: string
          group_id: string | null
          id: string
          reference_id: string
          reference_type: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_type: string
          group_id?: string | null
          id?: string
          reference_id: string
          reference_type: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          entry_type?: string
          group_id?: string | null
          id?: string
          reference_id?: string
          reference_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_coop_ledger_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_ledger_created_by_fkey1"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "group_coop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_ledger_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_ledger_reference_id_fkey"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "group_coop_loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_ledger_reference_id_fkey1"
            columns: ["reference_id"]
            isOneToOne: false
            referencedRelation: "group_coop_repayments"
            referencedColumns: ["id"]
          },
        ]
      }
      group_coop_loans: {
        Row: {
          coop_member_id: string
          created_at: string | null
          due_date: string | null
          group_id: string
          id: string
          interest_rate: number | null
          principal: number
          start_date: string | null
          status: string | null
          term_months: number
        }
        Insert: {
          coop_member_id: string
          created_at?: string | null
          due_date?: string | null
          group_id: string
          id?: string
          interest_rate?: number | null
          principal: number
          start_date?: string | null
          status?: string | null
          term_months: number
        }
        Update: {
          coop_member_id?: string
          created_at?: string | null
          due_date?: string | null
          group_id?: string
          id?: string
          interest_rate?: number | null
          principal?: number
          start_date?: string | null
          status?: string | null
          term_months?: number
        }
        Relationships: [
          {
            foreignKeyName: "group_coop_loans_coop_member_id_fkey"
            columns: ["coop_member_id"]
            isOneToOne: false
            referencedRelation: "group_coop_members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_loans_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_coop_members: {
        Row: {
          group_id: string
          id: string
          joined_at: string | null
          left_at: string | null
          role: string
          status: string
          user_id: string
        }
        Insert: {
          group_id: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string
          status?: string
          user_id: string
        }
        Update: {
          group_id?: string
          id?: string
          joined_at?: string | null
          left_at?: string | null
          role?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_coop_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_coop_repayments: {
        Row: {
          amount: number
          id: string
          loan_id: string
          note: string | null
          paid_at: string | null
          paid_by: string
        }
        Insert: {
          amount: number
          id?: string
          loan_id: string
          note?: string | null
          paid_at?: string | null
          paid_by: string
        }
        Update: {
          amount?: number
          id?: string
          loan_id?: string
          note?: string | null
          paid_at?: string | null
          paid_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_coop_repayments_loan_id_fkey"
            columns: ["loan_id"]
            isOneToOne: false
            referencedRelation: "group_coop_loans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_coop_repayments_paid_by_fkey"
            columns: ["paid_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_coop_settings: {
        Row: {
          created_at: string | null
          group_id: string
          interest_rate: number | null
          max_loan_amount: number | null
        }
        Insert: {
          created_at?: string | null
          group_id: string
          interest_rate?: number | null
          max_loan_amount?: number | null
        }
        Update: {
          created_at?: string | null
          group_id?: string
          interest_rate?: number | null
          max_loan_amount?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "group_coop_settings_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: true
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_event_attendance: {
        Row: {
          attend_at: string | null
          display_name: string | null
          event_id: string
          id: string
          notes: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          attend_at?: string | null
          display_name?: string | null
          event_id: string
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          attend_at?: string | null
          display_name?: string | null
          event_id?: string
          id?: string
          notes?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_event_attendance_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_event_attendance_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_event_contributions: {
        Row: {
          amount: number
          event_id: string | null
          id: string
          note: string | null
          paid_at: string | null
          user_id: string | null
        }
        Insert: {
          amount: number
          event_id?: string | null
          id?: string
          note?: string | null
          paid_at?: string | null
          user_id?: string | null
        }
        Update: {
          amount?: number
          event_id?: string | null
          id?: string
          note?: string | null
          paid_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_event_contributions_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_event_contributions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_event_minutes: {
        Row: {
          content: string
          created_at: string | null
          created_by: string | null
          event_id: string | null
          id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
        }
        Update: {
          content?: string
          created_at?: string | null
          created_by?: string | null
          event_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_event_minutes_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_event_minutes_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
        ]
      }
      group_event_tasks: {
        Row: {
          assigned_to: string | null
          description: string | null
          due_at: string | null
          event_id: string | null
          id: string
          status: string | null
          title: string
        }
        Insert: {
          assigned_to?: string | null
          description?: string | null
          due_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          title: string
        }
        Update: {
          assigned_to?: string | null
          description?: string | null
          due_at?: string | null
          event_id?: string | null
          id?: string
          status?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_event_tasks_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_event_tasks_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "group_events"
            referencedColumns: ["id"]
          },
        ]
      }
      group_events: {
        Row: {
          created_at: string | null
          description: string | null
          end_at: string | null
          group_id: string
          id: string
          location: string | null
          recurrence_rule: string | null
          start_at: string | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          group_id: string
          id?: string
          location?: string | null
          recurrence_rule?: string | null
          start_at?: string | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_at?: string | null
          group_id?: string
          id?: string
          location?: string | null
          recurrence_rule?: string | null
          start_at?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_events_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_finances: {
        Row: {
          amount: number
          created_at: string | null
          created_by: string | null
          description: string | null
          group_id: string | null
          id: string
          type: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          type?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          created_by?: string | null
          description?: string | null
          group_id?: string | null
          id?: string
          type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_finances_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_finances_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_invites: {
        Row: {
          code: string
          created_at: string
          expires_at: string | null
          group_id: string | null
          group_role_id: string | null
          id: string
        }
        Insert: {
          code: string
          created_at?: string
          expires_at?: string | null
          group_id?: string | null
          group_role_id?: string | null
          id?: string
        }
        Update: {
          code?: string
          created_at?: string
          expires_at?: string | null
          group_id?: string | null
          group_role_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_invites_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_invites_group_role_id_fkey"
            columns: ["group_role_id"]
            isOneToOne: false
            referencedRelation: "group_roles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_last_seen: {
        Row: {
          group_id: string
          last_seen_at: string
          message_last_seen_at: string | null
          user_id: string
        }
        Insert: {
          group_id: string
          last_seen_at?: string
          message_last_seen_at?: string | null
          user_id: string
        }
        Update: {
          group_id?: string
          last_seen_at?: string
          message_last_seen_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "group_last_seen_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_last_seen_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_members: {
        Row: {
          group_id: string | null
          id: string
          joinedat: string | null
          role_id: string | null
          user_id: string | null
        }
        Insert: {
          group_id?: string | null
          id?: string
          joinedat?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Update: {
          group_id?: string | null
          id?: string
          joinedat?: string | null
          role_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_members_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "group_roles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "group_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages: {
        Row: {
          attachment_url: string | null
          content: string | null
          createdat: string | null
          group_id: string | null
          id: string
          sender_id: string | null
        }
        Insert: {
          attachment_url?: string | null
          content?: string | null
          createdat?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Update: {
          attachment_url?: string | null
          content?: string | null
          createdat?: string | null
          group_id?: string | null
          id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "group_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      group_messages_with_profile: {
        Row: {
          content: string | null
          createdat: string | null
          full_name: string | null
          group_id: string
          id: string
          sender_id: string
        }
        Insert: {
          content?: string | null
          createdat?: string | null
          full_name?: string | null
          group_id: string
          id: string
          sender_id: string
        }
        Update: {
          content?: string | null
          createdat?: string | null
          full_name?: string | null
          group_id?: string
          id?: string
          sender_id?: string
        }
        Relationships: []
      }
      group_roles: {
        Row: {
          code: string | null
          createdat: string | null
          group_id: string | null
          id: string
          name: string
          permissions: string[] | null
        }
        Insert: {
          code?: string | null
          createdat?: string | null
          group_id?: string | null
          id?: string
          name: string
          permissions?: string[] | null
        }
        Update: {
          code?: string | null
          createdat?: string | null
          group_id?: string | null
          id?: string
          name?: string
          permissions?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "group_roles_group_id_fkey"
            columns: ["group_id"]
            isOneToOne: false
            referencedRelation: "groups"
            referencedColumns: ["id"]
          },
        ]
      }
      groups: {
        Row: {
          createdat: string | null
          description: string | null
          description_updatedat: string | null
          description_updatedby: string | null
          id: string
          image_url: string | null
          name: string
          owner_id: string | null
        }
        Insert: {
          createdat?: string | null
          description?: string | null
          description_updatedat?: string | null
          description_updatedby?: string | null
          id?: string
          image_url?: string | null
          name: string
          owner_id?: string | null
        }
        Update: {
          createdat?: string | null
          description?: string | null
          description_updatedat?: string | null
          description_updatedby?: string | null
          id?: string
          image_url?: string | null
          name?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "groups_description_updatedby_fkey"
            columns: ["description_updatedby"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "groups_owner_id_fkey1"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_public_id: string | null
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_public_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_public_id?: string | null
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_all_unread_for_user: {
        Args: { uid: string }
        Returns: {
          group_id: string
          unread_count: number
        }[]
      }
      get_coop_dashboard: {
        Args: { gid: string }
        Returns: {
          active_loan_count: number
          current_balance: number
          member_count: number
          outstanding_loan: number
          total_in: number
          total_out: number
        }[]
      }
      get_coop_financial_summary: {
        Args: { group_id: string }
        Returns: {
          active_loans: number
          closed_loans: number
          outstanding_balance: number
          total_credit: number
          total_debit: number
          total_loans: number
          total_repayments: number
        }[]
      }
      get_group_latest_and_unread: {
        Args: { uid: string }
        Returns: {
          group_id: string
          group_name: string
          last_createdat: string
          last_message: string
          last_sender_full_name: string
          unread_count: number
        }[]
      }
      get_group_messages: {
        Args: { gid: string; msg_id?: string }
        Returns: {
          content: string
          createdat: string
          id: string
          sender: Json
          sender_id: string
        }[]
      }
      get_unread_count_for_group: {
        Args: { gid: string; uid: string }
        Returns: number
      }
      get_unread_counts: {
        Args: { uid: string }
        Returns: {
          group_id: string
          unread_count: number
        }[]
      }
      get_user_groups: {
        Args: {
          is_asc?: boolean
          limit_rows?: number
          offset_rows?: number
          q?: string
          sort_by?: string
          uid: string
        }
        Returns: {
          createdat: string
          id: string
          image_url: string
          last_seen_at: string
          member_count: number
          message_last_seen_at: string
          name: string
          total_count: number
        }[]
      }
      mark_group_as_read: {
        Args: { gid: string; last_msg_at: string; uid: string }
        Returns: undefined
      }
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

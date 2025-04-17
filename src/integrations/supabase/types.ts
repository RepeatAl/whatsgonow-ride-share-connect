export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      analytics: {
        Row: {
          id: string
          page: string
          session_id: string
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          id?: string
          page: string
          session_id: string
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          id?: string
          page?: string
          session_id?: string
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      community_managers: {
        Row: {
          commission_rate: number | null
          region: string
          user_id: string
        }
        Insert: {
          commission_rate?: number | null
          region: string
          user_id: string
        }
        Update: {
          commission_rate?: number | null
          region?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_managers_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      delivery_logs: {
        Row: {
          action: string
          ip_address: string | null
          log_id: string
          order_id: string | null
          timestamp: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          ip_address?: string | null
          log_id?: string
          order_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          ip_address?: string | null
          log_id?: string
          order_id?: string | null
          timestamp?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_logs_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      feedback: {
        Row: {
          content: string
          created_at: string | null
          email: string | null
          features: string[] | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id: string
          satisfaction_rating: number | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          email?: string | null
          features?: string[] | null
          feedback_type: Database["public"]["Enums"]["feedback_type"]
          id?: string
          satisfaction_rating?: number | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          email?: string | null
          features?: string[] | null
          feedback_type?: Database["public"]["Enums"]["feedback_type"]
          id?: string
          satisfaction_rating?: number | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      feedback_responses: {
        Row: {
          admin_id: string | null
          content: string
          created_at: string | null
          feedback_id: string | null
          id: string
        }
        Insert: {
          admin_id?: string | null
          content: string
          created_at?: string | null
          feedback_id?: string | null
          id?: string
        }
        Update: {
          admin_id?: string | null
          content?: string
          created_at?: string | null
          feedback_id?: string | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "feedback_responses_feedback_id_fkey"
            columns: ["feedback_id"]
            isOneToOne: false
            referencedRelation: "feedback"
            referencedColumns: ["id"]
          },
        ]
      }
      invoice_access_log: {
        Row: {
          access_time: string | null
          details: Json | null
          invoice_id: string | null
          ip_address: string | null
          log_id: string
          status: string
          token_id: string | null
          user_agent: string | null
        }
        Insert: {
          access_time?: string | null
          details?: Json | null
          invoice_id?: string | null
          ip_address?: string | null
          log_id?: string
          status: string
          token_id?: string | null
          user_agent?: string | null
        }
        Update: {
          access_time?: string | null
          details?: Json | null
          invoice_id?: string | null
          ip_address?: string | null
          log_id?: string
          status?: string
          token_id?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_access_log_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_access_log_token_id_fkey"
            columns: ["token_id"]
            isOneToOne: false
            referencedRelation: "invoice_sms_tokens"
            referencedColumns: ["token_id"]
          },
        ]
      }
      invoice_addresses: {
        Row: {
          address_id: string
          building_number: string | null
          city: string | null
          company_name: string | null
          contact_person: string | null
          country: string | null
          department: string | null
          entity_type: string
          invoice_id: string | null
          postal_code: string | null
          street: string | null
          tax_id: string | null
          vat_id: string | null
        }
        Insert: {
          address_id?: string
          building_number?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          department?: string | null
          entity_type: string
          invoice_id?: string | null
          postal_code?: string | null
          street?: string | null
          tax_id?: string | null
          vat_id?: string | null
        }
        Update: {
          address_id?: string
          building_number?: string | null
          city?: string | null
          company_name?: string | null
          contact_person?: string | null
          country?: string | null
          department?: string | null
          entity_type?: string
          invoice_id?: string | null
          postal_code?: string | null
          street?: string | null
          tax_id?: string | null
          vat_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_addresses_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoice_audit_log: {
        Row: {
          action: string
          invoice_id: string | null
          ip_address: string | null
          log_id: string
          new_state: Json | null
          previous_state: Json | null
          timestamp: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action: string
          invoice_id?: string | null
          ip_address?: string | null
          log_id?: string
          new_state?: Json | null
          previous_state?: Json | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string
          invoice_id?: string | null
          ip_address?: string | null
          log_id?: string
          new_state?: Json | null
          previous_state?: Json | null
          timestamp?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_audit_log_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
          {
            foreignKeyName: "invoice_audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      invoice_line_items: {
        Row: {
          classification_code: string | null
          description: string
          invoice_id: string | null
          item_id: string
          product_code: string | null
          quantity: number
          tax_amount: number | null
          tax_category_code: string | null
          tax_rate: number | null
          total_price: number
          unit_of_measure: string
          unit_price: number
        }
        Insert: {
          classification_code?: string | null
          description: string
          invoice_id?: string | null
          item_id?: string
          product_code?: string | null
          quantity: number
          tax_amount?: number | null
          tax_category_code?: string | null
          tax_rate?: number | null
          total_price: number
          unit_of_measure: string
          unit_price: number
        }
        Update: {
          classification_code?: string | null
          description?: string
          invoice_id?: string | null
          item_id?: string
          product_code?: string | null
          quantity?: number
          tax_amount?: number | null
          tax_category_code?: string | null
          tax_rate?: number | null
          total_price?: number
          unit_of_measure?: string
          unit_price?: number
        }
        Relationships: [
          {
            foreignKeyName: "invoice_line_items_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoice_sms_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          invoice_id: string | null
          pin: string | null
          recipient_phone: string
          token: string
          token_id: string
          used: boolean | null
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          invoice_id?: string | null
          pin?: string | null
          recipient_phone: string
          token: string
          token_id?: string
          used?: boolean | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          invoice_id?: string | null
          pin?: string | null
          recipient_phone?: string
          token?: string
          token_id?: string
          used?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_sms_tokens_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoice_validation_results: {
        Row: {
          error_messages: Json | null
          invoice_id: string | null
          passed: boolean
          validation_date: string | null
          validation_id: string
          validation_type: string
          validator_version: string | null
          warning_messages: Json | null
        }
        Insert: {
          error_messages?: Json | null
          invoice_id?: string | null
          passed: boolean
          validation_date?: string | null
          validation_id?: string
          validation_type: string
          validator_version?: string | null
          warning_messages?: Json | null
        }
        Update: {
          error_messages?: Json | null
          invoice_id?: string | null
          passed?: boolean
          validation_date?: string | null
          validation_id?: string
          validation_type?: string
          validator_version?: string | null
          warning_messages?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "invoice_validation_results_invoice_id_fkey"
            columns: ["invoice_id"]
            isOneToOne: false
            referencedRelation: "invoices"
            referencedColumns: ["invoice_id"]
          },
        ]
      }
      invoices: {
        Row: {
          amount: number
          bic: string | null
          buyer_department: string | null
          buyer_tax_id: string | null
          created_at: string | null
          currency: string | null
          digital_signature: Json | null
          document_hash: string | null
          gobd_compliant: boolean | null
          iban: string | null
          invoice_id: string
          order_id: string | null
          payment_reference: string | null
          payment_terms: string | null
          pdf_url: string | null
          recipient_id: string | null
          retention_legal_basis: string | null
          retention_period: unknown | null
          scheduled_deletion_date: string | null
          sender_id: string | null
          sent_at: string | null
          status: string | null
          updated_at: string | null
          version: number | null
          xml_url: string | null
          xrechnung_compliant: boolean | null
        }
        Insert: {
          amount: number
          bic?: string | null
          buyer_department?: string | null
          buyer_tax_id?: string | null
          created_at?: string | null
          currency?: string | null
          digital_signature?: Json | null
          document_hash?: string | null
          gobd_compliant?: boolean | null
          iban?: string | null
          invoice_id?: string
          order_id?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          recipient_id?: string | null
          retention_legal_basis?: string | null
          retention_period?: unknown | null
          scheduled_deletion_date?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
          xml_url?: string | null
          xrechnung_compliant?: boolean | null
        }
        Update: {
          amount?: number
          bic?: string | null
          buyer_department?: string | null
          buyer_tax_id?: string | null
          created_at?: string | null
          currency?: string | null
          digital_signature?: Json | null
          document_hash?: string | null
          gobd_compliant?: boolean | null
          iban?: string | null
          invoice_id?: string
          order_id?: string | null
          payment_reference?: string | null
          payment_terms?: string | null
          pdf_url?: string | null
          recipient_id?: string | null
          retention_legal_basis?: string | null
          retention_period?: unknown | null
          scheduled_deletion_date?: string | null
          sender_id?: string | null
          sent_at?: string | null
          status?: string | null
          updated_at?: string | null
          version?: number | null
          xml_url?: string | null
          xrechnung_compliant?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "invoices_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "invoices_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "invoices_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          message_id: string
          order_id: string | null
          read: boolean | null
          recipient_id: string | null
          sender_id: string | null
          sent_at: string | null
        }
        Insert: {
          content: string
          message_id?: string
          order_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Update: {
          content?: string
          message_id?: string
          order_id?: string | null
          read?: boolean | null
          recipient_id?: string | null
          sender_id?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      offers: {
        Row: {
          driver_id: string | null
          offer_id: string
          order_id: string | null
          price: number
          status: string
        }
        Insert: {
          driver_id?: string | null
          offer_id?: string
          order_id?: string | null
          price: number
          status: string
        }
        Update: {
          driver_id?: string | null
          offer_id?: string
          order_id?: string | null
          price?: number
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "offers_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "offers_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          deadline: string
          description: string
          from_address: string
          order_id: string
          qr_code_token: string | null
          sender_id: string | null
          status: string
          to_address: string
          token_expires_at: string | null
          verified_at: string | null
          weight: number
        }
        Insert: {
          deadline: string
          description: string
          from_address: string
          order_id?: string
          qr_code_token?: string | null
          sender_id?: string | null
          status: string
          to_address: string
          token_expires_at?: string | null
          verified_at?: string | null
          weight: number
        }
        Update: {
          deadline?: string
          description?: string
          from_address?: string
          order_id?: string
          qr_code_token?: string | null
          sender_id?: string | null
          status?: string
          to_address?: string
          token_expires_at?: string | null
          verified_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "orders_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      ratings: {
        Row: {
          comment: string | null
          from_user: string | null
          order_id: string | null
          rating_id: string
          score: number | null
          to_user: string | null
        }
        Insert: {
          comment?: string | null
          from_user?: string | null
          order_id?: string | null
          rating_id?: string
          score?: number | null
          to_user?: string | null
        }
        Update: {
          comment?: string | null
          from_user?: string | null
          order_id?: string | null
          rating_id?: string
          score?: number | null
          to_user?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ratings_from_user_fkey"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "ratings_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "ratings_to_user_fkey"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          order_id: string | null
          payer_id: string | null
          receiver_id: string | null
          timestamp: string | null
          tx_id: string
        }
        Insert: {
          amount: number
          order_id?: string | null
          payer_id?: string | null
          receiver_id?: string | null
          timestamp?: string | null
          tx_id?: string
        }
        Update: {
          amount?: number
          order_id?: string | null
          payer_id?: string | null
          receiver_id?: string | null
          timestamp?: string | null
          tx_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "transactions_payer_id_fkey"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "transactions_receiver_id_fkey"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      user_profile_creation_log: {
        Row: {
          created_at: string | null
          error_message: string | null
          log_id: string
          metadata: Json | null
          success: boolean | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          error_message?: string | null
          log_id?: string
          metadata?: Json | null
          success?: boolean | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          error_message?: string | null
          log_id?: string
          metadata?: Json | null
          success?: boolean | null
          user_id?: string
        }
        Relationships: []
      }
      users: {
        Row: {
          active: boolean | null
          company_name: string | null
          created_at: string | null
          email: string
          language: string | null
          name: string
          profile_complete: boolean | null
          region: string | null
          role: string
          user_id: string
        }
        Insert: {
          active?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email: string
          language?: string | null
          name: string
          profile_complete?: boolean | null
          region?: string | null
          role: string
          user_id?: string
        }
        Update: {
          active?: boolean | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          language?: string | null
          name?: string
          profile_complete?: boolean | null
          region?: string | null
          role?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_view_sensitive_data: {
        Args: { requesting_user_id: string }
        Returns: boolean
      }
      is_admin: {
        Args: { requesting_user_id: string }
        Returns: boolean
      }
      is_profile_complete: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      feedback_type: "suggestion" | "bug" | "compliment" | "question"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      feedback_type: ["suggestion", "bug", "compliment", "question"],
    },
  },
} as const

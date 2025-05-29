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
      address_book: {
        Row: {
          address_extra: string | null
          city: string
          country: string
          created_at: string | null
          email: string | null
          house_number: string
          id: string
          is_default: boolean | null
          name: string | null
          phone: string | null
          postal_code: string
          source_type: string | null
          street: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address_extra?: string | null
          city: string
          country: string
          created_at?: string | null
          email?: string | null
          house_number: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          phone?: string | null
          postal_code: string
          source_type?: string | null
          street: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address_extra?: string | null
          city?: string
          country?: string
          created_at?: string | null
          email?: string | null
          house_number?: string
          id?: string
          is_default?: boolean | null
          name?: string | null
          phone?: string | null
          postal_code?: string
          source_type?: string | null
          street?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      admin_videos: {
        Row: {
          active: boolean | null
          description: string | null
          display_description_de: string | null
          display_description_en: string | null
          display_title_de: string | null
          display_title_en: string | null
          file_path: string
          file_size: number
          filename: string
          id: string
          mime_type: string
          original_name: string
          public: boolean | null
          public_url: string | null
          tags: string[] | null
          uploaded_at: string | null
          uploaded_by: string | null
        }
        Insert: {
          active?: boolean | null
          description?: string | null
          display_description_de?: string | null
          display_description_en?: string | null
          display_title_de?: string | null
          display_title_en?: string | null
          file_path: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          original_name: string
          public?: boolean | null
          public_url?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Update: {
          active?: boolean | null
          description?: string | null
          display_description_de?: string | null
          display_description_en?: string | null
          display_title_de?: string | null
          display_title_en?: string | null
          file_path?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          original_name?: string
          public?: boolean | null
          public_url?: string | null
          tags?: string[] | null
          uploaded_at?: string | null
          uploaded_by?: string | null
        }
        Relationships: []
      }
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
          delivery_verified_at: string | null
          ip_address: string | null
          log_id: string
          order_id: string | null
          proof_photo_url: string | null
          proof_type: string | null
          qr_hash: string | null
          timestamp: string | null
          user_id: string | null
          verified_by: string | null
        }
        Insert: {
          action: string
          delivery_verified_at?: string | null
          ip_address?: string | null
          log_id?: string
          order_id?: string | null
          proof_photo_url?: string | null
          proof_type?: string | null
          qr_hash?: string | null
          timestamp?: string | null
          user_id?: string | null
          verified_by?: string | null
        }
        Update: {
          action?: string
          delivery_verified_at?: string | null
          ip_address?: string | null
          log_id?: string
          order_id?: string | null
          proof_photo_url?: string | null
          proof_type?: string | null
          qr_hash?: string | null
          timestamp?: string | null
          user_id?: string | null
          verified_by?: string | null
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
      delivery_logs_audit: {
        Row: {
          action: string
          audit_id: string
          delivery_log_id: string | null
          ip_address: string | null
          new_state: Json | null
          performed_by: string | null
          previous_state: Json | null
          timestamp: string | null
          user_agent: string | null
        }
        Insert: {
          action: string
          audit_id?: string
          delivery_log_id?: string | null
          ip_address?: string | null
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Update: {
          action?: string
          audit_id?: string
          delivery_log_id?: string | null
          ip_address?: string | null
          new_state?: Json | null
          performed_by?: string | null
          previous_state?: Json | null
          timestamp?: string | null
          user_agent?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_logs_audit_delivery_log_id_fkey"
            columns: ["delivery_log_id"]
            isOneToOne: false
            referencedRelation: "delivery_logs"
            referencedColumns: ["log_id"]
          },
        ]
      }
      escalation_log: {
        Row: {
          escalation_type: string
          id: string
          metadata: Json | null
          notes: string | null
          resolved_at: string | null
          resolved_by: string | null
          trigger_reason: string
          triggered_at: string | null
          user_id: string | null
        }
        Insert: {
          escalation_type: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          trigger_reason: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Update: {
          escalation_type?: string
          id?: string
          metadata?: Json | null
          notes?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          trigger_reason?: string
          triggered_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escalation_log_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "escalation_log_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "escalation_log_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escalation_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "escalation_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "escalation_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
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
        Relationships: [
          {
            foreignKeyName: "fk_feedback_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_feedback_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_feedback_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
        ]
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
      item_analysis: {
        Row: {
          analysis_id: string
          brand_guess: string | null
          confidence_scores: Json | null
          created_at: string | null
          item_id: string | null
          labels: Json | null
          photo_url: string | null
          user_id: string
        }
        Insert: {
          analysis_id?: string
          brand_guess?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          item_id?: string | null
          labels?: Json | null
          photo_url?: string | null
          user_id: string
        }
        Update: {
          analysis_id?: string
          brand_guess?: string | null
          confidence_scores?: Json | null
          created_at?: string | null
          item_id?: string | null
          labels?: Json | null
          photo_url?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "item_analysis_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "order_items"
            referencedColumns: ["item_id"]
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
            foreignKeyName: "fk_messages_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_messages_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_messages_recipient"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_messages_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_messages_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_messages_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
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
      moderation_thresholds: {
        Row: {
          description: string
          key: string
          updated_at: string | null
          updated_by: string | null
          value: number
        }
        Insert: {
          description: string
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: number
        }
        Update: {
          description?: string
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: number
        }
        Relationships: [
          {
            foreignKeyName: "moderation_thresholds_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "moderation_thresholds_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "moderation_thresholds_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          entity_id: string
          event_type: string
          id: string
          message: string
          metadata: Json | null
          priority: string
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string
          entity_id: string
          event_type: string
          id?: string
          message: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string
          entity_id?: string
          event_type?: string
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
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
            foreignKeyName: "fk_offers_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_offers_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_offers_driver"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_offers_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
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
      order_drafts: {
        Row: {
          created_at: string | null
          draft_data: Json
          id: string
          photo_urls: string[] | null
          status: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          draft_data: Json
          id?: string
          photo_urls?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          draft_data?: Json
          id?: string
          photo_urls?: string[] | null
          status?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          analysis_status: string | null
          category_suggestion: string | null
          created_at: string | null
          description: string | null
          image_url: string | null
          item_id: string
          labels_raw: Json | null
          order_id: string | null
          title: string
        }
        Insert: {
          analysis_status?: string | null
          category_suggestion?: string | null
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          item_id?: string
          labels_raw?: Json | null
          order_id?: string | null
          title: string
        }
        Update: {
          analysis_status?: string | null
          category_suggestion?: string | null
          created_at?: string | null
          description?: string | null
          image_url?: string | null
          item_id?: string
          labels_raw?: Json | null
          order_id?: string | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
        ]
      }
      orders: {
        Row: {
          category: string
          deadline: string
          description: string
          fragile: boolean
          from_address: string
          item_name: string
          load_assistance: boolean
          negotiable: boolean
          order_id: string
          preferred_vehicle_type: string
          price: number
          published_at: string | null
          qr_code_token: string | null
          security_measures: string
          sender_id: string | null
          status: string
          to_address: string
          token_expires_at: string | null
          tools_required: string
          verified_at: string | null
          weight: number
        }
        Insert: {
          category?: string
          deadline: string
          description: string
          fragile?: boolean
          from_address: string
          item_name?: string
          load_assistance?: boolean
          negotiable?: boolean
          order_id?: string
          preferred_vehicle_type?: string
          price?: number
          published_at?: string | null
          qr_code_token?: string | null
          security_measures?: string
          sender_id?: string | null
          status: string
          to_address: string
          token_expires_at?: string | null
          tools_required?: string
          verified_at?: string | null
          weight: number
        }
        Update: {
          category?: string
          deadline?: string
          description?: string
          fragile?: boolean
          from_address?: string
          item_name?: string
          load_assistance?: boolean
          negotiable?: boolean
          order_id?: string
          preferred_vehicle_type?: string
          price?: number
          published_at?: string | null
          qr_code_token?: string | null
          security_measures?: string
          sender_id?: string | null
          status?: string
          to_address?: string
          token_expires_at?: string | null
          tools_required?: string
          verified_at?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_orders_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_orders_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_orders_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      pre_registrations: {
        Row: {
          consent_version: string
          created_at: string
          email: string
          first_name: string
          gdpr_consent: boolean
          id: string
          language: string | null
          last_name: string
          notes: string | null
          notification_sent: boolean
          postal_code: string
          source: string | null
          vehicle_types: Json | null
          wants_cm: boolean
          wants_driver: boolean
          wants_sender: boolean
        }
        Insert: {
          consent_version?: string
          created_at?: string
          email: string
          first_name: string
          gdpr_consent?: boolean
          id?: string
          language?: string | null
          last_name: string
          notes?: string | null
          notification_sent?: boolean
          postal_code: string
          source?: string | null
          vehicle_types?: Json | null
          wants_cm?: boolean
          wants_driver?: boolean
          wants_sender?: boolean
        }
        Update: {
          consent_version?: string
          created_at?: string
          email?: string
          first_name?: string
          gdpr_consent?: boolean
          id?: string
          language?: string | null
          last_name?: string
          notes?: string | null
          notification_sent?: boolean
          postal_code?: string
          source?: string | null
          vehicle_types?: Json | null
          wants_cm?: boolean
          wants_driver?: boolean
          wants_sender?: boolean
        }
        Relationships: []
      }
      profiles: {
        Row: {
          address_extra: string | null
          avatar_url: string | null
          can_become_driver: boolean | null
          city: string
          company_name: string | null
          created_at: string
          dashboard_access_enabled: boolean | null
          email: string
          first_name: string
          flag_reason: string | null
          flagged_at: string | null
          flagged_by_cm: boolean | null
          house_number: string | null
          is_pre_suspended: boolean | null
          is_suspended: boolean | null
          last_name: string
          name_affix: string | null
          onboarding_complete: boolean
          phone: string
          postal_code: string
          pre_suspend_at: string | null
          pre_suspend_reason: string | null
          profile_complete: boolean
          region: string
          role: string
          street: string | null
          suspended_until: string | null
          suspension_reason: string | null
          updated_at: string
          user_id: string
          verified: boolean | null
          wants_to_upload_items: boolean | null
        }
        Insert: {
          address_extra?: string | null
          avatar_url?: string | null
          can_become_driver?: boolean | null
          city: string
          company_name?: string | null
          created_at?: string
          dashboard_access_enabled?: boolean | null
          email: string
          first_name: string
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by_cm?: boolean | null
          house_number?: string | null
          is_pre_suspended?: boolean | null
          is_suspended?: boolean | null
          last_name: string
          name_affix?: string | null
          onboarding_complete?: boolean
          phone: string
          postal_code: string
          pre_suspend_at?: string | null
          pre_suspend_reason?: string | null
          profile_complete?: boolean
          region: string
          role: string
          street?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
          wants_to_upload_items?: boolean | null
        }
        Update: {
          address_extra?: string | null
          avatar_url?: string | null
          can_become_driver?: boolean | null
          city?: string
          company_name?: string | null
          created_at?: string
          dashboard_access_enabled?: boolean | null
          email?: string
          first_name?: string
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by_cm?: boolean | null
          house_number?: string | null
          is_pre_suspended?: boolean | null
          is_suspended?: boolean | null
          last_name?: string
          name_affix?: string | null
          onboarding_complete?: boolean
          phone?: string
          postal_code?: string
          pre_suspend_at?: string | null
          pre_suspend_reason?: string | null
          profile_complete?: boolean
          region?: string
          role?: string
          street?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
          wants_to_upload_items?: boolean | null
        }
        Relationships: []
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
            foreignKeyName: "fk_ratings_from_user"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_ratings_from_user"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_ratings_from_user"
            columns: ["from_user"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_ratings_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "fk_ratings_to_user"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_ratings_to_user"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_ratings_to_user"
            columns: ["to_user"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
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
      rides: {
        Row: {
          arrival_time: string | null
          available_capacity_kg: number | null
          available_capacity_m3: number | null
          created_at: string | null
          departure_time: string
          description: string | null
          driver_id: string
          end_address: string
          end_postal_code: string | null
          flexible_time: boolean | null
          flexible_time_hours: number | null
          id: string
          max_stops: number | null
          price_per_kg: number | null
          recurring: boolean | null
          start_address: string
          start_postal_code: string | null
          status: string | null
          updated_at: string | null
          vehicle_type: string | null
        }
        Insert: {
          arrival_time?: string | null
          available_capacity_kg?: number | null
          available_capacity_m3?: number | null
          created_at?: string | null
          departure_time: string
          description?: string | null
          driver_id: string
          end_address: string
          end_postal_code?: string | null
          flexible_time?: boolean | null
          flexible_time_hours?: number | null
          id?: string
          max_stops?: number | null
          price_per_kg?: number | null
          recurring?: boolean | null
          start_address: string
          start_postal_code?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Update: {
          arrival_time?: string | null
          available_capacity_kg?: number | null
          available_capacity_m3?: number | null
          created_at?: string | null
          departure_time?: string
          description?: string | null
          driver_id?: string
          end_address?: string
          end_postal_code?: string | null
          flexible_time?: boolean | null
          flexible_time_hours?: number | null
          id?: string
          max_stops?: number | null
          price_per_kg?: number | null
          recurring?: boolean | null
          start_address?: string
          start_postal_code?: string | null
          status?: string | null
          updated_at?: string | null
          vehicle_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      role_change_logs: {
        Row: {
          changed_by: string
          id: string
          new_role: string
          old_role: string
          target_user: string
          timestamp: string
        }
        Insert: {
          changed_by: string
          id?: string
          new_role: string
          old_role: string
          target_user: string
          timestamp?: string
        }
        Update: {
          changed_by?: string
          id?: string
          new_role?: string
          old_role?: string
          target_user?: string
          timestamp?: string
        }
        Relationships: []
      }
      system_logs: {
        Row: {
          actor_id: string | null
          created_at: string | null
          entity_id: string
          entity_type: string
          event_type: string
          log_id: string
          metadata: Json | null
          severity: string | null
          visible_to: string[] | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          entity_id: string
          entity_type: string
          event_type: string
          log_id?: string
          metadata?: Json | null
          severity?: string | null
          visible_to?: string[] | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          entity_id?: string
          entity_type?: string
          event_type?: string
          log_id?: string
          metadata?: Json | null
          severity?: string | null
          visible_to?: string[] | null
        }
        Relationships: []
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
            foreignKeyName: "fk_transactions_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["order_id"]
          },
          {
            foreignKeyName: "fk_transactions_payer"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_transactions_payer"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_transactions_payer"
            columns: ["payer_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_transactions_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_transactions_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "fk_transactions_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
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
      trust_score_audit: {
        Row: {
          actor_id: string | null
          created_at: string | null
          id: string
          previous_score: number | null
          reason: string | null
          score: number
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          previous_score?: number | null
          reason?: string | null
          score: number
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          id?: string
          previous_score?: number | null
          reason?: string | null
          score?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "trust_score_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trust_score_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trust_score_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "trust_score_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trust_score_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "trust_score_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
        ]
      }
      upload_events: {
        Row: {
          created_at: string | null
          event_type: string
          id: string
          payload: Json | null
          session_id: string
        }
        Insert: {
          created_at?: string | null
          event_type: string
          id?: string
          payload?: Json | null
          session_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string
          id?: string
          payload?: Json | null
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "upload_events_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "upload_sessions"
            referencedColumns: ["session_id"]
          },
        ]
      }
      upload_sessions: {
        Row: {
          completed: boolean | null
          created_at: string | null
          expires_at: string | null
          session_id: string
          target: string
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          session_id?: string
          target: string
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          session_id?: string
          target?: string
          user_id?: string
        }
        Relationships: []
      }
      user_flag_audit: {
        Row: {
          actor_id: string | null
          created_at: string | null
          flagged: boolean | null
          id: string
          reason: string | null
          role: string | null
          user_id: string | null
        }
        Insert: {
          actor_id?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id?: string
          reason?: string | null
          role?: string | null
          user_id?: string | null
        }
        Update: {
          actor_id?: string | null
          created_at?: string | null
          flagged?: boolean | null
          id?: string
          reason?: string | null
          role?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_flag_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_flag_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_flag_audit_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_flag_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "active_profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_flag_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "user_flag_audit_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_regions"
            referencedColumns: ["id"]
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
          address_extra: string | null
          avatar_url: string | null
          city: string | null
          company_name: string | null
          created_at: string | null
          email: string
          house_number: string | null
          language: string | null
          name: string
          name_affix: string | null
          onboarding_complete: boolean | null
          phone: string | null
          postal_code: string | null
          profile_complete: boolean | null
          region: string
          role: string
          street: string | null
          user_id: string
          verified: boolean | null
        }
        Insert: {
          active?: boolean | null
          address_extra?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email: string
          house_number?: string | null
          language?: string | null
          name: string
          name_affix?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          postal_code?: string | null
          profile_complete?: boolean | null
          region: string
          role: string
          street?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Update: {
          active?: boolean | null
          address_extra?: string | null
          avatar_url?: string | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          email?: string
          house_number?: string | null
          language?: string | null
          name?: string
          name_affix?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          postal_code?: string | null
          profile_complete?: boolean | null
          region?: string
          role?: string
          street?: string | null
          user_id?: string
          verified?: boolean | null
        }
        Relationships: []
      }
    }
    Views: {
      active_profiles: {
        Row: {
          address_extra: string | null
          avatar_url: string | null
          can_become_driver: boolean | null
          city: string | null
          company_name: string | null
          created_at: string | null
          dashboard_access_enabled: boolean | null
          email: string | null
          first_name: string | null
          flag_reason: string | null
          flagged_at: string | null
          flagged_by_cm: boolean | null
          house_number: string | null
          is_pre_suspended: boolean | null
          is_suspended: boolean | null
          last_name: string | null
          name_affix: string | null
          onboarding_complete: boolean | null
          phone: string | null
          postal_code: string | null
          pre_suspend_at: string | null
          pre_suspend_reason: string | null
          profile_complete: boolean | null
          region: string | null
          role: string | null
          street: string | null
          suspended_until: string | null
          suspension_reason: string | null
          updated_at: string | null
          user_id: string | null
          verified: boolean | null
          wants_to_upload_items: boolean | null
        }
        Insert: {
          address_extra?: string | null
          avatar_url?: string | null
          can_become_driver?: boolean | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          dashboard_access_enabled?: boolean | null
          email?: string | null
          first_name?: string | null
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by_cm?: boolean | null
          house_number?: string | null
          is_pre_suspended?: boolean | null
          is_suspended?: boolean | null
          last_name?: string | null
          name_affix?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          postal_code?: string | null
          pre_suspend_at?: string | null
          pre_suspend_reason?: string | null
          profile_complete?: boolean | null
          region?: string | null
          role?: string | null
          street?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          wants_to_upload_items?: boolean | null
        }
        Update: {
          address_extra?: string | null
          avatar_url?: string | null
          can_become_driver?: boolean | null
          city?: string | null
          company_name?: string | null
          created_at?: string | null
          dashboard_access_enabled?: boolean | null
          email?: string | null
          first_name?: string | null
          flag_reason?: string | null
          flagged_at?: string | null
          flagged_by_cm?: boolean | null
          house_number?: string | null
          is_pre_suspended?: boolean | null
          is_suspended?: boolean | null
          last_name?: string | null
          name_affix?: string | null
          onboarding_complete?: boolean | null
          phone?: string | null
          postal_code?: string | null
          pre_suspend_at?: string | null
          pre_suspend_reason?: string | null
          profile_complete?: boolean | null
          region?: string | null
          role?: string | null
          street?: string | null
          suspended_until?: string | null
          suspension_reason?: string | null
          updated_at?: string | null
          user_id?: string | null
          verified?: boolean | null
          wants_to_upload_items?: boolean | null
        }
        Relationships: []
      }
      user_regions: {
        Row: {
          id: string | null
          region: string | null
        }
        Insert: {
          id?: string | null
          region?: string | null
        }
        Update: {
          id?: string | null
          region?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      assign_role: {
        Args: { target_user_id: string; new_role: string }
        Returns: boolean
      }
      can_view_sensitive_data: {
        Args: { requesting_user_id: string }
        Returns: boolean
      }
      evaluate_escalation: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      flag_user: {
        Args: { target_user_id: string; flag_reason: string }
        Returns: boolean
      }
      get_user_region: {
        Args: { user_id: string }
        Returns: string
      }
      is_admin: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_admin_user: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_community_manager: {
        Args: { user_id: string }
        Returns: boolean
      }
      is_profile_complete: {
        Args: { user_id: string }
        Returns: boolean
      }
      pre_suspend_user: {
        Args: { target_user_id: string; reason: string }
        Returns: boolean
      }
      resolve_escalation: {
        Args: { escalation_id: string; resolution_notes: string }
        Returns: boolean
      }
      unflag_user: {
        Args: { target_user_id: string }
        Returns: boolean
      }
      unsuspend_expired_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
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

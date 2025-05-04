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
        Relationships: [
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
          house_number: string | null
          last_name: string
          name_affix: string | null
          onboarding_complete: boolean
          phone: string
          postal_code: string
          profile_complete: boolean
          region: string
          role: string
          street: string | null
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
          house_number?: string | null
          last_name: string
          name_affix?: string | null
          onboarding_complete?: boolean
          phone: string
          postal_code: string
          profile_complete?: boolean
          region: string
          role: string
          street?: string | null
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
          house_number?: string | null
          last_name?: string
          name_affix?: string | null
          onboarding_complete?: boolean
          phone?: string
          postal_code?: string
          profile_complete?: boolean
          region?: string
          role?: string
          street?: string | null
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

/**
 * Patas do Bem — Tipos TypeScript do Banco de Dados (Supabase / PostgreSQL)
 * Compatível com @supabase/supabase-js e @supabase/ssr
 */

export type UserRole = "donor" | "rescuer" | "admin";
export type OrganizationType = "independent" | "ong";
export type OrganizationStatus = "pending_approval" | "approved" | "suspended" | "rejected";
export type AnimalSpecies = "dog" | "cat" | "other";
export type AnimalStatus = "under_treatment" | "recovered" | "adopted" | "deceased";
export type CampaignCategory = "surgery" | "treatment" | "food" | "shelter" | "emergency";
export type CampaignUrgency = "high" | "medium" | "low";
export type CampaignStatus = "draft" | "pending_approval" | "active" | "paused" | "completed" | "cancelled";
export type DonationStatus = "pending" | "processing" | "paid" | "failed" | "refunded" | "cancelled";
export type PaymentMethod = "pix" | "credit_card";
export type PaymentEventStatus = "received" | "processed" | "failed";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          role: UserRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          phone?: string | null;
          role?: UserRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      organizations: {
        Row: {
          id: string;
          owner_id: string;
          name: string;
          type: OrganizationType;
          document: string;
          city: string;
          state: string;
          bio: string | null;
          pix_key: string | null;
          bank_account_info: Record<string, unknown> | null;
          status: OrganizationStatus;
          verified_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          name: string;
          type?: OrganizationType;
          document: string;
          city: string;
          state: string;
          bio?: string | null;
          pix_key?: string | null;
          bank_account_info?: Record<string, unknown> | null;
          status?: OrganizationStatus;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          owner_id?: string;
          name?: string;
          type?: OrganizationType;
          document?: string;
          city?: string;
          state?: string;
          bio?: string | null;
          pix_key?: string | null;
          bank_account_info?: Record<string, unknown> | null;
          status?: OrganizationStatus;
          verified_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      animals: {
        Row: {
          id: string;
          organization_id: string;
          name: string;
          species: AnimalSpecies;
          breed: string | null;
          approximate_age: string | null;
          medical_history: string | null;
          photo_url: string | null;
          status: AnimalStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          name: string;
          species: AnimalSpecies;
          breed?: string | null;
          approximate_age?: string | null;
          medical_history?: string | null;
          photo_url?: string | null;
          status?: AnimalStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          name?: string;
          species?: AnimalSpecies;
          breed?: string | null;
          approximate_age?: string | null;
          medical_history?: string | null;
          photo_url?: string | null;
          status?: AnimalStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          organization_id: string;
          animal_id: string;
          title: string;
          slug: string;
          category: CampaignCategory;
          category_label: string;
          summary: string;
          story: string;
          target_amount_cents: number;
          raised_amount_cents: number;
          supporters_count: number;
          urgency: CampaignUrgency;
          status: CampaignStatus;
          image_url: string;
          approved_by: string | null;
          approved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          organization_id: string;
          animal_id: string;
          title: string;
          slug: string;
          category: CampaignCategory;
          category_label: string;
          summary: string;
          story: string;
          target_amount_cents: number;
          raised_amount_cents?: number;
          supporters_count?: number;
          urgency?: CampaignUrgency;
          status?: CampaignStatus;
          image_url: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          organization_id?: string;
          animal_id?: string;
          title?: string;
          slug?: string;
          category?: CampaignCategory;
          category_label?: string;
          summary?: string;
          story?: string;
          target_amount_cents?: number;
          raised_amount_cents?: number;
          supporters_count?: number;
          urgency?: CampaignUrgency;
          status?: CampaignStatus;
          image_url?: string;
          approved_by?: string | null;
          approved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      campaign_updates: {
        Row: {
          id: string;
          campaign_id: string;
          title: string | null;
          description: string;
          receipt_urls: string[];
          photo_urls: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          title?: string | null;
          description: string;
          receipt_urls?: string[];
          photo_urls?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          title?: string | null;
          description?: string;
          receipt_urls?: string[];
          photo_urls?: string[];
          created_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          campaign_id: string;
          donor_id: string | null;
          amount_cents: number;
          net_amount_cents: number | null;
          fee_cents: number;
          status: DonationStatus;
          payment_method: PaymentMethod;
          is_anonymous: boolean;
          donor_display_name: string | null;
          donor_email: string | null;
          external_reference_id: string | null;
          paid_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          donor_id?: string | null;
          amount_cents: number;
          net_amount_cents?: number | null;
          fee_cents?: number;
          status?: DonationStatus;
          payment_method?: PaymentMethod;
          is_anonymous?: boolean;
          donor_display_name?: string | null;
          donor_email?: string | null;
          external_reference_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          donor_id?: string | null;
          amount_cents?: number;
          net_amount_cents?: number | null;
          fee_cents?: number;
          status?: DonationStatus;
          payment_method?: PaymentMethod;
          is_anonymous?: boolean;
          donor_display_name?: string | null;
          donor_email?: string | null;
          external_reference_id?: string | null;
          paid_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      payment_events: {
        Row: {
          id: string;
          gateway: string;
          event_id: string;
          event_type: string;
          external_reference_id: string;
          payload: Record<string, unknown>;
          status: PaymentEventStatus;
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          gateway: string;
          event_id: string;
          event_type: string;
          external_reference_id: string;
          payload: Record<string, unknown>;
          status?: PaymentEventStatus;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          gateway?: string;
          event_id?: string;
          event_type?: string;
          external_reference_id?: string;
          payload?: Record<string, unknown>;
          status?: PaymentEventStatus;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
      };
    };
    Views: {
      public_organizations: {
        Row: {
          id: string;
          name: string;
          type: OrganizationType;
          city: string;
          state: string;
          bio: string | null;
          status: OrganizationStatus;
          verified_at: string | null;
          created_at: string;
        };
      };
      public_donations: {
        Row: {
          id: string;
          campaign_id: string;
          amount_cents: number;
          donor_display_name: string | null;
          created_at: string;
          paid_at: string | null;
        };
      };
    };
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      process_payment_webhook_idempotent: {
        Args: {
          p_gateway: string;
          p_event_id: string;
          p_event_type: string;
          p_external_reference_id: string;
          p_amount_cents: number;
          p_fee_cents: number;
          p_payload: Record<string, unknown>;
          p_currency?: string;
        };
        Returns: Record<string, unknown>;
      };
    };
  };
}

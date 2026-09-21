export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  __InternalSupabase: {
    PostgrestVersion: "12"
  }
  public: {
    Tables: {
      projects: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          content: string | null
          category: 'Photo' | 'Web' | 'Design' | 'Projects'
          tags: string[]
          technologies: string[]
          client: string | null
          project_date: string | null
          featured_image: string | null
          images: string[]
          featured: boolean
          published: boolean
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          content?: string | null
          category: 'Photo' | 'Web' | 'Design' | 'Projects'
          tags?: string[]
          technologies?: string[]
          client?: string | null
          project_date?: string | null
          featured_image?: string | null
          images?: string[]
          featured?: boolean
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          content?: string | null
          category?: 'Photo' | 'Web' | 'Design' | 'Projects'
          tags?: string[]
          technologies?: string[]
          client?: string | null
          project_date?: string | null
          featured_image?: string | null
          images?: string[]
          featured?: boolean
          published?: boolean
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      event_bookings: {
        Row: {
          id: string
          first_name: string
          last_name: string
          email: string
          phone: string
          event_date: string
          slot: string
          message: string | null
          client_email_sent_at: string | null
          admin_email_sent_at: string | null
          review_email_sent_at: string | null
          status: 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          first_name: string
          last_name: string
          email: string
          phone: string
          event_date: string
          slot: string
          message?: string | null
          client_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          review_email_sent_at?: string | null
          status?: 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string
          event_date?: string
          slot?: string
          message?: string | null
          client_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          review_email_sent_at?: string | null
          status?: 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      studio_bookings: {
        Row: {
          id: string
          stripe_session_id: string
          first_name: string
          last_name: string
          email: string
          phone: string | null
          siret: string | null
          company_name: string | null
          service: string
          booking_date: string
          formatted_date: string | null
          slot: string
          duration: number
          payment_mode: 'full' | 'deposit'
          amount_paid_cents: number
          message: string | null
          client_email_sent_at: string | null
          admin_email_sent_at: string | null
          review_email_sent_at: string | null
          status: 'confirmed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          stripe_session_id: string
          first_name: string
          last_name: string
          email: string
          phone?: string | null
          siret?: string | null
          company_name?: string | null
          service: string
          booking_date: string
          formatted_date?: string | null
          slot: string
          duration: number
          payment_mode?: 'full' | 'deposit'
          amount_paid_cents: number
          message?: string | null
          client_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          review_email_sent_at?: string | null
          status?: 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          stripe_session_id?: string
          first_name?: string
          last_name?: string
          email?: string
          phone?: string | null
          siret?: string | null
          company_name?: string | null
          service?: string
          booking_date?: string
          formatted_date?: string | null
          slot?: string
          duration?: number
          payment_mode?: 'full' | 'deposit'
          amount_paid_cents?: number
          message?: string | null
          client_email_sent_at?: string | null
          admin_email_sent_at?: string | null
          review_email_sent_at?: string | null
          status?: 'confirmed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}

export type Project = Database['public']['Tables']['projects']['Row']
export type EventBooking = Database['public']['Tables']['event_bookings']['Row']
export type StudioBooking = Database['public']['Tables']['studio_bookings']['Row']

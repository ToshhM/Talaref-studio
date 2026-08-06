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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
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
      }
    }
  }
}

export type Project = Database['public']['Tables']['projects']['Row']

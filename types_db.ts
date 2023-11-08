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
      followers: {
        Row: {
          created_at: string
          follower_profile_id: string
          target_profile_id: string
        }
        Insert: {
          created_at?: string
          follower_profile_id: string
          target_profile_id: string
        }
        Update: {
          created_at?: string
          follower_profile_id?: string
          target_profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_follower_profile_id_fkey"
            columns: ["follower_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_target_profile_id_fkey"
            columns: ["target_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      liked_ratings: {
        Row: {
          created_at: string
          id: number
          profile_id: string
          rating_id: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          profile_id: string
          rating_id?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          profile_id?: string
          rating_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "liked_ratings_profile_id_fkey"
            columns: ["profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liked_ratings_rating_id_fkey"
            columns: ["rating_id"]
            referencedRelation: "ratings"
            referencedColumns: ["id"]
          }
        ]
      }
      notifications: {
        Row: {
          created_at: string
          from_profile_id: string | null
          id: number
          to_profile_id: string | null
          type: number | null
        }
        Insert: {
          created_at?: string
          from_profile_id?: string | null
          id?: number
          to_profile_id?: string | null
          type?: number | null
        }
        Update: {
          created_at?: string
          from_profile_id?: string | null
          id?: number
          to_profile_id?: string | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_from_profile_id_fkey"
            columns: ["from_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_to_profile_id_fkey"
            columns: ["to_profile_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          username?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      ratings: {
        Row: {
          created_at: string
          id: number
          isPublic: boolean | null
          message: string | null
          rating: number | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          isPublic?: boolean | null
          message?: string | null
          rating?: number | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: number
          isPublic?: boolean | null
          message?: string | null
          rating?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ratings_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
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

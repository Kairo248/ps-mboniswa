/**
 * Dual-Identity Platform (Gospel Artist & Pastor)
 * TypeScript definitions matching Supabase schema
 */

export type AppRole = 'super_admin' | 'editor';

export type ContentCategory = 'Sermon' | 'Music' | 'Event';

export type ContentStatusTag = 'Hot' | 'New' | 'Popular' | 'Live';

/** profiles – Admin RBAC */
export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  role: AppRole;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export type ProfileInsert = Omit<Profile, 'created_at' | 'updated_at'> & {
  created_at?: string;
  updated_at?: string;
};

export type ProfileUpdate = Partial<Omit<Profile, 'id'>>;

/** content_feed */
export interface ContentFeed {
  id: string;
  title: string;
  description: string | null;
  media_url: string | null;
  category: ContentCategory;
  status_tag: ContentStatusTag | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type ContentFeedInsert = Omit<ContentFeed, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ContentFeedUpdate = Partial<Omit<ContentFeed, 'id'>>;

/** itinerary – upcoming appearances */
export interface Itinerary {
  id: string;
  title: string;
  event_date: string;
  location_name: string | null;
  location_coord: string | null;
  ticket_link: string | null;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  created_by: string | null;
}

export type ItineraryInsert = Omit<Itinerary, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
  created_at?: string;
  updated_at?: string;
};

export type ItineraryUpdate = Partial<Omit<Itinerary, 'id'>>;

/** Supabase generated types (for use with createClient<Database>) */
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: ProfileInsert;
        Update: ProfileUpdate;
      };
      content_feed: {
        Row: ContentFeed;
        Insert: ContentFeedInsert;
        Update: ContentFeedUpdate;
      };
      itinerary: {
        Row: Itinerary;
        Insert: ItineraryInsert;
        Update: ItineraryUpdate;
      };
    };
    Enums: {
      app_role: AppRole;
      content_category: ContentCategory;
      content_status_tag: ContentStatusTag;
    };
  };
}

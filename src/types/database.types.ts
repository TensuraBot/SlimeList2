export interface Database {
  public: {
    Tables: {
      anime_list: {
        Row: {
          id: number;
          user_id: string;
          anime_id: number;
          title: string;
          image_url: string;
          status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
          episodes_watched: number;
          total_episodes: number;
          score: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: number;
          user_id: string;
          anime_id: number;
          title: string;
          image_url: string;
          status: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
          episodes_watched: number;
          total_episodes: number;
          score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: number;
          user_id?: string;
          anime_id?: number;
          title?: string;
          image_url?: string;
          status?: 'watching' | 'completed' | 'plan_to_watch' | 'dropped';
          episodes_watched?: number;
          total_episodes?: number;
          score?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_profiles: {
        Row: {
          id: string;
          username: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          username: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          username?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type AnimeStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

export interface JikanAnime {
  mal_id: number;
  title: string;
  title_english: string | null;
  title_japanese: string | null;
  type: string;
  source: string;
  episodes: number;
  status: string;
  airing: boolean;
  aired: {
    from: string;
    to: string | null;
    string: string;
  };
  duration: string;
  rating: string;
  score: number;
  scored_by: number;
  rank: number;
  popularity: number;
  members: number;
  favorites: number;
  synopsis: string;
  background: string | null;
  season: string | null;
  year: number | null;
  studios: { mal_id: number; name: string }[];
  genres: { mal_id: number; name: string }[];
  images: {
    jpg: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
    webp: {
      image_url: string;
      small_image_url: string;
      large_image_url: string;
    };
  };
}
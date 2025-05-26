import { createClient } from '@supabase/supabase-js';
import { Database } from '../types/database.types';

// These would typically come from environment variables
// For development purposes, we're using placeholder values
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export type UserAnimeStatus = 'watching' | 'completed' | 'plan_to_watch' | 'dropped';

export interface AnimeListItem {
  id: number;
  user_id: string;
  anime_id: number;
  title: string;
  image_url: string;
  status: UserAnimeStatus;
  episodes_watched: number;
  total_episodes: number;
  score: number | null;
  created_at: string;
  updated_at: string;
}

// User-related functions
export async function signUp(username: string, password: string) {
  return supabase.auth.signUp({
    email: `${username}@slimelist.local`, // Using username as email
    password,
    options: {
      data: {
        username,
      },
    },
  });
}

export async function signIn(username: string, password: string) {
  return supabase.auth.signInWithPassword({
    email: `${username}@slimelist.local`,
    password,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}

// Anime list functions
export async function getUserAnimeList(userId: string) {
  return supabase
    .from('anime_list')
    .select('*')
    .eq('user_id', userId);
}

export async function getAnimeByStatus(userId: string, status: UserAnimeStatus) {
  return supabase
    .from('anime_list')
    .select('*')
    .eq('user_id', userId)
    .eq('status', status);
}

export async function addAnimeToList(animeData: Omit<AnimeListItem, 'id' | 'created_at' | 'updated_at'>) {
  return supabase
    .from('anime_list')
    .upsert(
      {
        ...animeData,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,anime_id' }
    );
}

export async function updateAnimeStatus(
  userId: string,
  animeId: number,
  status: UserAnimeStatus,
  episodesWatched: number,
  score?: number
) {
  return supabase
    .from('anime_list')
    .update({
      status,
      episodes_watched: episodesWatched,
      score,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId)
    .eq('anime_id', animeId);
}

export async function removeAnimeFromList(userId: string, animeId: number) {
  return supabase
    .from('anime_list')
    .delete()
    .eq('user_id', userId)
    .eq('anime_id', animeId);
}
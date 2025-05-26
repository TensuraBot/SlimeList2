// Service for interacting with the Jikan API (MyAnimeList unofficial API)
import { JikanAnime } from '../types/database.types';

const API_BASE_URL = 'https://api.jikan.moe/v4';

// Delay function to handle Jikan API rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Helper function to handle API requests with rate limiting
async function fetchWithRateLimit(endpoint: string) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`);
    
    // Check if we hit the rate limit
    if (response.status === 429) {
      // Wait for 1 second and try again
      await delay(1000);
      return fetchWithRateLimit(endpoint);
    }
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

// Get popular anime
export async function getPopularAnime(page = 1, limit = 12) {
  const data = await fetchWithRateLimit(`/top/anime?page=${page}&limit=${limit}`);
  return data.data as JikanAnime[];
}

// Get seasonal anime
export async function getSeasonalAnime(page = 1, limit = 12) {
  const data = await fetchWithRateLimit(`/seasons/now?page=${page}&limit=${limit}`);
  return data.data as JikanAnime[];
}

// Search anime by title
export async function searchAnime(query: string, page = 1, limit = 20) {
  if (!query.trim()) return { data: [], pagination: { last_visible_page: 0 } };
  
  const data = await fetchWithRateLimit(`/anime?q=${encodeURIComponent(query)}&page=${page}&limit=${limit}`);
  return {
    data: data.data as JikanAnime[],
    pagination: data.pagination,
  };
}

// Get anime by ID
export async function getAnimeById(id: number) {
  const data = await fetchWithRateLimit(`/anime/${id}/full`);
  return data.data as JikanAnime;
}

// Get anime recommendations
export async function getAnimeRecommendations(id: number) {
  const data = await fetchWithRateLimit(`/anime/${id}/recommendations`);
  return data.data;
}

// Get random anime
export async function getRandomAnime() {
  const data = await fetchWithRateLimit('/random/anime');
  return data.data as JikanAnime;
}
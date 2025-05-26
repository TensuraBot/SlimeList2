import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { List as ListIcon } from 'lucide-react';
import AnimeCard from '../components/anime/AnimeCard';
import StatusFilter from '../components/anime/StatusFilter';
import Loader from '../components/ui/Loader';
import { useAuth } from '../contexts/AuthContext';
import { AnimeListItem, AnimeStatus, getUserAnimeList } from '../services/supabase';
import { JikanAnime } from '../types/database.types';

const MyList: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState<AnimeListItem[]>([]);
  const [filteredList, setFilteredList] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentStatus, setCurrentStatus] = useState<AnimeStatus | 'all'>('all');
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchAnimeList = async () => {
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from Supabase
        // For demonstration, we'll use mock data
        const mockData: AnimeListItem[] = [
          {
            id: 1,
            user_id: user.id,
            anime_id: 52991,
            title: "Sousou no Frieren",
            image_url: "https://cdn.myanimelist.net/images/anime/1015/138006.jpg",
            status: "watching",
            episodes_watched: 16,
            total_episodes: 28,
            score: 9,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 2,
            user_id: user.id,
            anime_id: 21,
            title: "One Piece",
            image_url: "https://cdn.myanimelist.net/images/anime/6/73245.jpg",
            status: "watching",
            episodes_watched: 1037,
            total_episodes: 0,
            score: 8,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 3,
            user_id: user.id,
            anime_id: 51105,
            title: "Jujutsu Kaisen 2nd Season",
            image_url: "https://cdn.myanimelist.net/images/anime/1792/138022.jpg",
            status: "completed",
            episodes_watched: 23,
            total_episodes: 23,
            score: 8,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 4,
            user_id: user.id,
            anime_id: 54595,
            title: "Blue Lock 2nd Season",
            image_url: "https://cdn.myanimelist.net/images/anime/1879/137907.jpg",
            status: "plan_to_watch",
            episodes_watched: 0,
            total_episodes: 12,
            score: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 5,
            user_id: user.id,
            anime_id: 48417,
            title: "Chainsaw Man",
            image_url: "https://cdn.myanimelist.net/images/anime/1788/126013.jpg",
            status: "completed",
            episodes_watched: 12,
            total_episodes: 12,
            score: 9,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 6,
            user_id: user.id,
            anime_id: 30276,
            title: "One Punch Man",
            image_url: "https://cdn.myanimelist.net/images/anime/12/76049.jpg",
            status: "completed",
            episodes_watched: 12,
            total_episodes: 12,
            score: 8,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: 7,
            user_id: user.id,
            anime_id: 11061,
            title: "Hunter x Hunter (2011)",
            image_url: "https://cdn.myanimelist.net/images/anime/1337/111867.jpg",
            status: "dropped",
            episodes_watched: 75,
            total_episodes: 148,
            score: 7,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ];
        
        setAnimeList(mockData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching anime list:', error);
        setLoading(false);
      }
    };
    
    fetchAnimeList();
  }, [user, navigate]);
  
  // Filter the list when status changes
  useEffect(() => {
    if (currentStatus === 'all') {
      setFilteredList(animeList);
    } else {
      setFilteredList(animeList.filter(anime => anime.status === currentStatus));
    }
  }, [currentStatus, animeList]);
  
  // Handle status change
  const handleStatusChange = (status: AnimeStatus | 'all') => {
    setCurrentStatus(status);
  };
  
  // Transform AnimeListItem to JikanAnime (for compatibility with AnimeCard)
  const transformToJikanAnime = (item: AnimeListItem): JikanAnime => {
    return {
      mal_id: item.anime_id,
      title: item.title,
      images: {
        jpg: {
          image_url: item.image_url,
          small_image_url: item.image_url,
          large_image_url: item.image_url,
        },
        webp: {
          image_url: item.image_url,
          small_image_url: item.image_url,
          large_image_url: item.image_url,
        }
      },
      type: "",
      episodes: item.total_episodes,
      score: item.score || 0,
      // Other required fields with default values
      title_english: null,
      title_japanese: null,
      source: "",
      status: "",
      airing: false,
      aired: { from: "", to: null, string: "" },
      duration: "",
      rating: "",
      scored_by: 0,
      rank: 0,
      popularity: 0,
      members: 0,
      favorites: 0,
      synopsis: "",
      background: null,
      season: null,
      year: null,
      studios: [],
      genres: [],
    };
  };
  
  if (loading) {
    return <Loader />;
  }
  
  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">My Anime List</h1>
      
      {/* Status Filters */}
      <StatusFilter currentStatus={currentStatus} onStatusChange={handleStatusChange} />
      
      {/* Stats Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Total Anime</p>
          <p className="text-2xl font-bold text-white">{animeList.length}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Watching</p>
          <p className="text-2xl font-bold text-blue-500">
            {animeList.filter(a => a.status === 'watching').length}
          </p>
        </div>
        <div className="bg-dark-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-500">
            {animeList.filter(a => a.status === 'completed').length}
          </p>
        </div>
        <div className="bg-dark-700 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Plan to Watch</p>
          <p className="text-2xl font-bold text-yellow-500">
            {animeList.filter(a => a.status === 'plan_to_watch').length}
          </p>
        </div>
      </div>
      
      {/* Anime List */}
      {filteredList.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredList.map(anime => (
            <AnimeCard 
              key={anime.id}
              anime={transformToJikanAnime(anime)}
              status={anime.status}
              episodesWatched={anime.episodes_watched}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <ListIcon size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">
            {currentStatus === 'all' 
              ? 'Your anime list is empty' 
              : `No anime in "${currentStatus.replace('_', ' ')}" status`}
          </h3>
          <p className="text-gray-400 mb-4">
            {currentStatus === 'all' 
              ? 'Start adding anime to your list!' 
              : 'Try selecting a different status filter'}
          </p>
          {currentStatus === 'all' && (
            <button
              onClick={() => navigate('/search')}
              className="btn-primary"
            >
              Browse Anime
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default MyList;
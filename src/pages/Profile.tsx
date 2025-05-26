import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronRight, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { AnimeListItem } from '../services/supabase';
import Loader from '../components/ui/Loader';

const Profile: React.FC = () => {
  const { user, username } = useAuth();
  const navigate = useNavigate();
  const [animeList, setAnimeList] = useState<AnimeListItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Stats
  const [stats, setStats] = useState({
    totalAnime: 0,
    totalEpisodes: 0,
    avgScore: 0,
    favoriteGenres: ['Action', 'Adventure', 'Fantasy'], // Mocked data
    watchingCount: 0,
    completedCount: 0,
    planToWatchCount: 0,
    droppedCount: 0,
  });
  
  useEffect(() => {
    // Redirect if not logged in
    if (!user) {
      navigate('/login');
      return;
    }
    
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Mock data for demonstration
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
          }
        ];
        
        setAnimeList(mockData);
        
        // Calculate stats
        const totalAnime = mockData.length;
        const totalEpisodes = mockData.reduce((sum, anime) => sum + anime.episodes_watched, 0);
        const watchingCount = mockData.filter(a => a.status === 'watching').length;
        const completedCount = mockData.filter(a => a.status === 'completed').length;
        const planToWatchCount = mockData.filter(a => a.status === 'plan_to_watch').length;
        const droppedCount = mockData.filter(a => a.status === 'dropped').length;
        
        // Calculate average score
        const animeWithScores = mockData.filter(anime => anime.score !== null);
        const avgScore = animeWithScores.length > 0
          ? animeWithScores.reduce((sum, anime) => sum + (anime.score || 0), 0) / animeWithScores.length
          : 0;
        
        setStats({
          totalAnime,
          totalEpisodes,
          avgScore,
          favoriteGenres: ['Action', 'Fantasy', 'Adventure'], // Mocked data
          watchingCount,
          completedCount,
          planToWatchCount,
          droppedCount,
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setLoading(false);
      }
    };
    
    fetchUserData();
  }, [user, navigate]);
  
  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* User Profile Header */}
      <div className="bg-dark-700 rounded-xl p-8 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          <div className="w-24 h-24 bg-primary-800 rounded-full flex items-center justify-center">
            <User size={48} className="text-primary-200" />
          </div>
          
          <div className="flex-grow text-center md:text-left">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{username}</h1>
            <p className="text-gray-400">Member since {new Date().toLocaleDateString()}</p>
            
            <div className="mt-4 flex flex-wrap gap-6 justify-center md:justify-start">
              <div>
                <p className="text-sm text-gray-400">Anime</p>
                <p className="text-xl font-bold text-white">{stats.totalAnime}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Episodes</p>
                <p className="text-xl font-bold text-white">{stats.totalEpisodes}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Avg. Score</p>
                <p className="text-xl font-bold text-primary-400">
                  {stats.avgScore > 0 ? stats.avgScore.toFixed(1) : '-'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Stats Cards */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center">
        <BarChart3 size={20} className="mr-2 text-primary-400" />
        My Anime Stats
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-dark-700 rounded-lg p-5 border-l-4 border-blue-500">
          <p className="text-sm text-gray-400">Watching</p>
          <p className="text-2xl font-bold text-white">{stats.watchingCount}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-5 border-l-4 border-green-500">
          <p className="text-sm text-gray-400">Completed</p>
          <p className="text-2xl font-bold text-white">{stats.completedCount}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-5 border-l-4 border-yellow-500">
          <p className="text-sm text-gray-400">Plan to Watch</p>
          <p className="text-2xl font-bold text-white">{stats.planToWatchCount}</p>
        </div>
        <div className="bg-dark-700 rounded-lg p-5 border-l-4 border-red-500">
          <p className="text-sm text-gray-400">Dropped</p>
          <p className="text-2xl font-bold text-white">{stats.droppedCount}</p>
        </div>
      </div>
      
      {/* Favorite Genres */}
      <div className="bg-dark-700 rounded-lg p-5 mb-8">
        <h3 className="text-lg font-semibold text-white mb-3">Favorite Genres</h3>
        <div className="flex flex-wrap gap-2">
          {stats.favoriteGenres.map((genre, index) => (
            <span 
              key={index}
              className="px-3 py-1 bg-primary-900 text-primary-300 rounded-full text-sm"
            >
              {genre}
            </span>
          ))}
        </div>
      </div>
      
      {/* Recent Activity */}
      <h2 className="text-xl font-bold text-white mb-4">Recent Activity</h2>
      
      <div className="bg-dark-700 rounded-lg overflow-hidden mb-8">
        {animeList.slice(0, 5).map((anime) => (
          <div 
            key={anime.id}
            className="flex items-center p-4 border-b border-dark-600 last:border-b-0 hover:bg-dark-600 transition-colors"
            onClick={() => navigate(`/anime/${anime.anime_id}`)}
          >
            <img 
              src={anime.image_url} 
              alt={anime.title}
              className="w-12 h-16 object-cover rounded mr-4"
            />
            
            <div className="flex-grow">
              <h4 className="text-white font-medium">{anime.title}</h4>
              <p className="text-sm text-gray-400">
                {anime.status === 'watching' && `Watching: ${anime.episodes_watched} / ${anime.total_episodes || '?'}`}
                {anime.status === 'completed' && 'Completed'}
                {anime.status === 'plan_to_watch' && 'Plan to Watch'}
                {anime.status === 'dropped' && `Dropped at episode ${anime.episodes_watched}`}
              </p>
            </div>
            
            <ChevronRight size={20} className="text-gray-500" />
          </div>
        ))}
      </div>
      
      {/* View All Button */}
      <div className="text-center">
        <button
          onClick={() => navigate('/my-list')}
          className="btn-secondary"
        >
          View My Full List
        </button>
      </div>
    </div>
  );
};

export default Profile;
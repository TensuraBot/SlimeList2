import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Clock, Star, Film, User, PlusCircle, Minus, Plus, Info, X } from 'lucide-react';
import Loader from '../components/ui/Loader';
import { getAnimeById, getAnimeRecommendations } from '../services/jikanApi';
import { addAnimeToList, updateAnimeStatus, AnimeListItem, UserAnimeStatus } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { JikanAnime } from '../types/database.types';
import AnimeCard from '../components/anime/AnimeCard';

const AnimeDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [anime, setAnime] = useState<JikanAnime | null>(null);
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userStatus, setUserStatus] = useState<{
    status: UserAnimeStatus | null;
    episodesWatched: number;
    score: number | null;
  }>({
    status: null,
    episodesWatched: 0,
    score: null,
  });
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchAnimeDetails = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        // Fetch anime details
        const animeData = await getAnimeById(parseInt(id));
        setAnime(animeData);
        
        // Fetch recommendations
        const recommendationsData = await getAnimeRecommendations(parseInt(id));
        setRecommendations(recommendationsData.slice(0, 6));
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime details:', err);
        setError('Failed to load anime details. Please try again later.');
        setLoading(false);
      }
    };
    
    // TODO: In a real implementation, we would fetch the user's status for this anime
    // For now, just initialize with default values
    
    fetchAnimeDetails();
  }, [id]);
  
  const handleAddToList = async (status: UserAnimeStatus) => {
    if (!user || !anime) return;
    
    try {
      await addAnimeToList({
        user_id: user.id,
        anime_id: anime.mal_id,
        title: anime.title,
        image_url: anime.images.jpg.image_url,
        status,
        episodes_watched: userStatus.episodesWatched,
        total_episodes: anime.episodes || 0,
        score: userStatus.score,
      });
      
      setUserStatus({
        ...userStatus,
        status,
      });
      
      setShowStatusModal(false);
    } catch (err) {
      console.error('Error adding anime to list:', err);
      // Show error notification
    }
  };
  
  const handleUpdateEpisodes = async (change: number) => {
    if (!user || !anime || !userStatus.status) return;
    
    const newEpisodesWatched = Math.max(0, Math.min(userStatus.episodesWatched + change, anime.episodes || 9999));
    
    // Auto-complete if reached final episode
    const newStatus = (newEpisodesWatched === anime.episodes && anime.episodes > 0) 
      ? 'completed' 
      : userStatus.status;
    
    try {
      await updateAnimeStatus(
        user.id,
        anime.mal_id,
        newStatus,
        newEpisodesWatched,
        userStatus.score
      );
      
      setUserStatus({
        ...userStatus,
        status: newStatus,
        episodesWatched: newEpisodesWatched,
      });
    } catch (err) {
      console.error('Error updating episodes:', err);
      // Show error notification
    }
  };
  
  if (loading) {
    return <Loader size="lg" />;
  }
  
  if (error || !anime) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Info size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error || 'Anime not found'}</p>
        <Link to="/search" className="btn-primary">
          Back to Search
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Anime Header */}
      <div className="relative">
        {/* Cover Image Background (blurred) */}
        <div 
          className="absolute inset-0 bg-cover bg-center blur-md opacity-20 -z-10"
          style={{ backgroundImage: `url(${anime.images.jpg.large_image_url})` }}
        ></div>
        
        <div className="flex flex-col md:flex-row gap-8 p-6 bg-dark-800 bg-opacity-80 rounded-xl">
          {/* Anime Poster */}
          <div className="w-full md:w-64 flex-shrink-0">
            <img 
              src={anime.images.jpg.large_image_url} 
              alt={anime.title}
              className="w-full rounded-lg shadow-lg"
            />
            
            {/* Action Buttons */}
            <div className="mt-4 space-y-2">
              {userStatus.status ? (
                <>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-white font-medium">Status:</span>
                    <span className="text-primary-400 capitalize">
                      {userStatus.status.replace('_', ' ')}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-white font-medium">Episodes:</span>
                    <div className="flex items-center">
                      <button
                        onClick={() => handleUpdateEpisodes(-1)}
                        disabled={userStatus.episodesWatched <= 0}
                        className="p-1 rounded bg-dark-700 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-dark-700"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="mx-2 text-white">
                        {userStatus.episodesWatched} / {anime.episodes || '?'}
                      </span>
                      <button
                        onClick={() => handleUpdateEpisodes(1)}
                        disabled={anime.episodes ? userStatus.episodesWatched >= anime.episodes : false}
                        className="p-1 rounded bg-dark-700 hover:bg-primary-400 disabled:opacity-50 disabled:hover:bg-dark-700"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                  
                  <button
                    onClick={() => setShowStatusModal(true)}
                    className="w-full btn-secondary"
                  >
                    Update Status
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowStatusModal(true)}
                  className="w-full btn-primary flex items-center justify-center"
                >
                  <PlusCircle size={18} className="mr-2" />
                  Add to My List
                </button>
              )}
            </div>
          </div>
          
          {/* Anime Details */}
          <div className="flex-grow">
            <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">{anime.title}</h1>
            {anime.title_english && anime.title_english !== anime.title && (
              <h2 className="text-xl text-gray-300 mb-1">{anime.title_english}</h2>
            )}
            {anime.title_japanese && (
              <h3 className="text-md text-gray-400 mb-4">{anime.title_japanese}</h3>
            )}
            
            <div className="flex flex-wrap gap-4 mb-6">
              {anime.score > 0 && (
                <div className="flex items-center">
                  <Star className="text-yellow-400 mr-1" size={18} />
                  <span className="text-white font-medium">{anime.score.toFixed(1)}</span>
                  <span className="text-gray-400 text-sm ml-1">({anime.scored_by.toLocaleString()} votes)</span>
                </div>
              )}
              
              {anime.type && (
                <div className="flex items-center">
                  <Film className="text-primary-400 mr-1" size={18} />
                  <span className="text-white">{anime.type}</span>
                </div>
              )}
              
              {anime.episodes > 0 && (
                <div className="flex items-center">
                  <Clock className="text-primary-400 mr-1" size={18} />
                  <span className="text-white">{anime.episodes} episodes</span>
                </div>
              )}
              
              {anime.aired?.from && (
                <div className="flex items-center">
                  <Calendar className="text-primary-400 mr-1" size={18} />
                  <span className="text-white">
                    {new Date(anime.aired.from).getFullYear()}
                    {anime.aired.to && ` - ${new Date(anime.aired.to).getFullYear()}`}
                  </span>
                </div>
              )}
            </div>
            
            {/* Genres */}
            {anime.genres && anime.genres.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.genres.map(genre => (
                    <span 
                      key={genre.mal_id}
                      className="px-3 py-1 bg-dark-700 text-gray-300 rounded-full text-sm"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Studios */}
            {anime.studios && anime.studios.length > 0 && (
              <div className="mb-6">
                <h3 className="text-lg font-medium text-white mb-2">Studios</h3>
                <div className="flex flex-wrap gap-2">
                  {anime.studios.map(studio => (
                    <span 
                      key={studio.mal_id}
                      className="px-3 py-1 bg-dark-700 text-primary-300 rounded-full text-sm"
                    >
                      {studio.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            {/* Synopsis */}
            {anime.synopsis && (
              <div>
                <h3 className="text-lg font-medium text-white mb-2">Synopsis</h3>
                <p className="text-gray-300 leading-relaxed">{anime.synopsis}</p>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Recommendations */}
      {recommendations.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Similar Anime</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recommendations.map(rec => (
              <AnimeCard key={rec.entry.mal_id} anime={{
                mal_id: rec.entry.mal_id,
                title: rec.entry.title,
                images: rec.entry.images,
                score: 0,
                genres: [],
                type: '',
                episodes: 0,
                aired: { from: '', to: null, string: '' },
                season: null,
                year: null,
                studios: [],
                source: '',
                status: '',
                airing: false,
                duration: '',
                rating: '',
                scored_by: 0,
                rank: 0,
                popularity: 0,
                members: 0,
                favorites: 0,
                synopsis: '',
                background: null,
                title_english: null,
                title_japanese: null,
              }} />
            ))}
          </div>
        </section>
      )}
      
      {/* Status Update Modal */}
      {showStatusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-dark-800 rounded-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-white">Update Anime Status</h3>
              <button 
                onClick={() => setShowStatusModal(false)}
                className="text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <button
                onClick={() => handleAddToList('watching')}
                className="w-full py-3 px-4 flex items-center rounded-lg bg-dark-700 hover:bg-blue-500 text-white transition-colors"
              >
                <Eye size={20} className="mr-3" />
                <span>Currently Watching</span>
              </button>
              
              <button
                onClick={() => handleAddToList('completed')}
                className="w-full py-3 px-4 flex items-center rounded-lg bg-dark-700 hover:bg-green-500 text-white transition-colors"
              >
                <CheckCircle size={20} className="mr-3" />
                <span>Completed</span>
              </button>
              
              <button
                onClick={() => handleAddToList('plan_to_watch')}
                className="w-full py-3 px-4 flex items-center rounded-lg bg-dark-700 hover:bg-yellow-500 text-white transition-colors"
              >
                <Clock size={20} className="mr-3" />
                <span>Plan to Watch</span>
              </button>
              
              <button
                onClick={() => handleAddToList('dropped')}
                className="w-full py-3 px-4 flex items-center rounded-lg bg-dark-700 hover:bg-red-500 text-white transition-colors"
              >
                <X size={20} className="mr-3" />
                <span>Dropped</span>
              </button>
            </div>
            
            {userStatus.status && (
              <div className="border-t border-dark-600 pt-4">
                <button
                  onClick={async () => {
                    if (!user || !anime) return;
                    
                    try {
                      // Remove from list function would be called here
                      setUserStatus({
                        status: null,
                        episodesWatched: 0,
                        score: null,
                      });
                      setShowStatusModal(false);
                    } catch (err) {
                      console.error('Error removing anime from list:', err);
                    }
                  }}
                  className="w-full py-2 text-red-400 hover:text-red-300"
                >
                  Remove from My List
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnimeDetail;
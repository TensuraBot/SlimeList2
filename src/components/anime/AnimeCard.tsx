import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, CheckCircle, Clock, XCircle } from 'lucide-react';
import { JikanAnime, AnimeStatus } from '../../types/database.types';

interface AnimeCardProps {
  anime: JikanAnime;
  status?: AnimeStatus;
  episodesWatched?: number;
  onStatusChange?: (newStatus: AnimeStatus) => void;
}

const AnimeCard: React.FC<AnimeCardProps> = ({ 
  anime, 
  status, 
  episodesWatched,
  onStatusChange 
}) => {
  const statusIcons = {
    watching: <Eye size={16} className="mr-1" />,
    completed: <CheckCircle size={16} className="mr-1" />,
    plan_to_watch: <Clock size={16} className="mr-1" />,
    dropped: <XCircle size={16} className="mr-1" />
  };
  
  const statusColors = {
    watching: 'bg-blue-500',
    completed: 'bg-green-500',
    plan_to_watch: 'bg-yellow-500',
    dropped: 'bg-red-500'
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <div className="bg-dark-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 h-full flex flex-col">
      <Link to={`/anime/${anime.mal_id}`} className="relative block overflow-hidden">
        <img 
          src={anime.images.jpg.large_image_url || anime.images.jpg.image_url} 
          alt={anime.title}
          className="w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Rating tag */}
        {anime.score > 0 && (
          <div className="absolute top-2 right-2 bg-dark-900 bg-opacity-80 text-white px-2 py-1 rounded text-sm font-medium">
            ★ {anime.score.toFixed(1)}
          </div>
        )}
        
        {/* Status tag (if in user's list) */}
        {status && (
          <div className={`absolute top-2 left-2 ${statusColors[status]} text-white px-2 py-1 rounded text-xs font-medium flex items-center`}>
            {statusIcons[status]}
            {status.replace('_', ' ')}
          </div>
        )}
        
        {/* Episodes watched (if in user's list) */}
        {status && typeof episodesWatched !== 'undefined' && (
          <div className="absolute bottom-2 right-2 bg-dark-900 bg-opacity-80 text-white px-2 py-1 rounded text-xs">
            {episodesWatched} / {anime.episodes || '?'}
          </div>
        )}
      </Link>
      
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/anime/${anime.mal_id}`} className="block">
          <h3 className="font-semibold text-lg mb-1 text-white hover:text-primary-400 transition-colors">
            {truncateText(anime.title, 40)}
          </h3>
        </Link>
        
        <div className="text-xs text-gray-400 mb-2 flex items-center flex-wrap">
          {anime.type && <span className="mr-2">{anime.type}</span>}
          {anime.episodes && <span className="mr-2">{anime.episodes} eps</span>}
          {anime.season && anime.year && (
            <span>{anime.season.charAt(0).toUpperCase() + anime.season.slice(1)} {anime.year}</span>
          )}
        </div>
        
        {anime.genres && anime.genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 mb-3">
            {anime.genres.slice(0, 3).map(genre => (
              <span 
                key={genre.mal_id}
                className="text-xs bg-dark-600 text-gray-300 px-2 py-1 rounded"
              >
                {genre.name}
              </span>
            ))}
          </div>
        )}
        
        {/* Status change buttons (if provided) */}
        {onStatusChange && (
          <div className="mt-auto pt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => onStatusChange('watching')}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                status === 'watching' ? 'bg-blue-500 text-white' : 'bg-dark-600 hover:bg-blue-500 hover:text-white'
              }`}
            >
              <Eye size={14} className="mr-1" /> Watching
            </button>
            <button
              onClick={() => onStatusChange('plan_to_watch')}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                status === 'plan_to_watch' ? 'bg-yellow-500 text-white' : 'bg-dark-600 hover:bg-yellow-500 hover:text-white'
              }`}
            >
              <Clock size={14} className="mr-1" /> Plan
            </button>
            <button
              onClick={() => onStatusChange('completed')}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                status === 'completed' ? 'bg-green-500 text-white' : 'bg-dark-600 hover:bg-green-500 hover:text-white'
              }`}
            >
              <CheckCircle size={14} className="mr-1" /> Complete
            </button>
            <button
              onClick={() => onStatusChange('dropped')}
              className={`text-xs px-2 py-1 rounded flex items-center justify-center ${
                status === 'dropped' ? 'bg-red-500 text-white' : 'bg-dark-600 hover:bg-red-500 hover:text-white'
              }`}
            >
              <XCircle size={14} className="mr-1" /> Drop
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimeCard;
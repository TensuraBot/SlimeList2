import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Film, ChevronRight } from 'lucide-react';
import AnimeCard from '../components/anime/AnimeCard';
import Loader from '../components/ui/Loader';
import { getPopularAnime, getSeasonalAnime } from '../services/jikanApi';
import { JikanAnime } from '../types/database.types';

const Home: React.FC = () => {
  const [popularAnime, setPopularAnime] = useState<JikanAnime[]>([]);
  const [seasonalAnime, setSeasonalAnime] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch popular anime
        const popular = await getPopularAnime(1, 8);
        setPopularAnime(popular);
        
        // Fetch seasonal anime
        const seasonal = await getSeasonalAnime(1, 8);
        setSeasonalAnime(seasonal);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching anime data:', err);
        setError('Failed to load anime data. Please try again later.');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return <Loader size="lg" />;
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <Film size={48} className="text-primary-400 mb-4" />
        <h2 className="text-xl font-bold text-white mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-400 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="btn-primary"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-900 rounded-xl p-8 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
          Welcome to SlimeList
        </h1>
        <p className="text-lg text-gray-200 mb-6 max-w-2xl">
          Track your anime journey, discover new shows, and build your personal collection.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link to="/search" className="btn-primary">
            Explore Anime
          </Link>
          <Link to="/my-list" className="btn-outline">
            View My List
          </Link>
        </div>
      </div>
      
      {/* Popular Anime Section */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Popular Anime</h2>
          <Link to="/search?sort=popularity" className="text-primary-400 hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {popularAnime.map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
      
      {/* Seasonal Anime Section */}
      <section>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Seasonal Anime</h2>
          <Link to="/search?filter=seasonal" className="text-primary-400 hover:underline flex items-center">
            View All <ChevronRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {seasonalAnime.map(anime => (
            <AnimeCard key={anime.mal_id} anime={anime} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
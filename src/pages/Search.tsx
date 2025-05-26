import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import AnimeCard from '../components/anime/AnimeCard';
import Loader from '../components/ui/Loader';
import { searchAnime } from '../services/jikanApi';
import { JikanAnime } from '../types/database.types';

const Search: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<JikanAnime[]>([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQuery);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
      if (query !== initialQuery) {
        setSearchParams(query ? { q: query } : {});
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [query, initialQuery, setSearchParams]);

  // Fetch results when debounced query changes
  useEffect(() => {
    const fetchResults = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setTotalPages(0);
        return;
      }
      
      setLoading(true);
      try {
        const { data, pagination } = await searchAnime(debouncedQuery, currentPage);
        setResults(data);
        setTotalPages(pagination.last_visible_page);
      } catch (error) {
        console.error('Error searching anime:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchResults();
  }, [debouncedQuery, currentPage]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };
  
  // Generate pagination array
  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      // Show all pages
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else {
      // Show limited range with ellipses
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          range.push(i);
        }
        range.push('ellipsis');
        range.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        range.push(1);
        range.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          range.push(i);
        }
      } else {
        // Middle
        range.push(1);
        range.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          range.push(i);
        }
        range.push('ellipsis');
        range.push(totalPages);
      }
    }
    
    return range;
  };

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <h1 className="text-2xl md:text-3xl font-bold text-white mb-6">Search Anime</h1>
      
      {/* Search Input */}
      <div className="relative mb-8">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <SearchIcon size={20} className="text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search for an anime..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-dark-700 border border-dark-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-primary-400/50"
        />
      </div>
      
      {/* Results */}
      {loading ? (
        <Loader />
      ) : results.length > 0 ? (
        <>
          <p className="text-gray-400 mb-4">
            Found {results.length} results{totalPages > 1 ? `, page ${currentPage} of ${totalPages}` : ''}
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-8">
            {results.map(anime => (
              <AnimeCard key={anime.mal_id} anime={anime} />
            ))}
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8">
              <nav className="flex items-center space-x-1">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === 1 ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-700 text-white hover:bg-primary-400'
                  }`}
                >
                  Previous
                </button>
                
                {getPaginationRange().map((page, index) => (
                  page === 'ellipsis' ? (
                    <span key={`ellipsis-${index}`} className="px-3 py-1 text-gray-400">...</span>
                  ) : (
                    <button
                      key={`page-${page}`}
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-1 rounded ${
                        currentPage === page
                          ? 'bg-primary-400 text-white'
                          : 'bg-dark-700 text-white hover:bg-dark-600'
                      }`}
                    >
                      {page}
                    </button>
                  )
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 rounded ${
                    currentPage === totalPages ? 'bg-dark-700 text-gray-500 cursor-not-allowed' : 'bg-dark-700 text-white hover:bg-primary-400'
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      ) : debouncedQuery ? (
        <div className="text-center py-16">
          <SearchIcon size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
          <p className="text-gray-400">Try a different search term</p>
        </div>
      ) : (
        <div className="text-center py-16">
          <SearchIcon size={48} className="mx-auto text-gray-600 mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Search for your favorite anime</h3>
          <p className="text-gray-400">Enter a title in the search box above</p>
        </div>
      )}
    </div>
  );
};

export default Search;
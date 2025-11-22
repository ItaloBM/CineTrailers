import React, { useState, useEffect, useMemo } from 'react';
import { MovieService } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Filter, Search } from 'lucide-react';

const Home = ({ apiKey, favorites, onToggleFavorite, onPlay }) => {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Filtros
  const [selectedGenre, setSelectedGenre] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [moviesData, genresData] = await Promise.all([
          MovieService.getUpcoming(apiKey),
          MovieService.getGenres(apiKey)
        ]);
        setMovies(moviesData.results || []);
        setGenres(genresData.genres || []);
      } catch (err) {
        setError('Erro ao carregar dados. Verifique a API Key.');
      } finally {
        setLoading(false);
      }
    };

    if (apiKey) fetchData();
  }, [apiKey]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      if (selectedGenre && !movie.genre_ids.includes(parseInt(selectedGenre))) return false;
      if (filterDate && !movie.release_date.startsWith(filterDate)) return false;
      return true;
    });
  }, [movies, selectedGenre, filterDate]);

  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;

  return (
    <>
      <div className="mb-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Próximos Lançamentos</h1>
            <p className="text-gray-400">Acompanhe o que está chegando aos cinemas.</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3 bg-gray-900 p-3 rounded-lg border border-gray-800">
            <div className="flex items-center gap-2 text-gray-400 px-2">
              <Filter size={18} />
              <span className="text-sm font-bold">Filtros:</span>
            </div>
            
            <select 
              value={selectedGenre} 
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-gray-800 text-white text-sm rounded px-3 py-2 border-none focus:ring-1 focus:ring-red-500 outline-none"
            >
              <option value="">Todos os Gêneros</option>
              {genres.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
            </select>

            <input 
              type="month" 
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-gray-800 text-white text-sm rounded px-3 py-2 border-none focus:ring-1 focus:ring-red-500 outline-none [color-scheme:dark]"
            />

            {(selectedGenre || filterDate) && (
              <button 
                onClick={() => { setSelectedGenre(''); setFilterDate(''); }}
                className="text-xs text-red-400 hover:text-red-300 underline px-2"
              >
                Limpar
              </button>
            )}
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-[2/3] bg-gray-800 rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.length > 0 ? (
            filteredMovies.map(movie => (
              <MovieCard 
                key={movie.id}
                movie={movie}
                genresList={genres}
                onPlay={onPlay}
                isFavorite={favorites.some(f => f.movieId === movie.id)}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Nenhum filme encontrado com estes filtros.</p>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Home;
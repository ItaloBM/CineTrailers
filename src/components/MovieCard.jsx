import React from 'react';
import { Play, Calendar, Star, Heart } from 'lucide-react';

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const MovieCard = ({ movie, genresList, onPlay, isFavorite, onToggleFavorite }) => {
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'TBA';
  
  const movieGenres = movie.genre_ids 
    ? movie.genre_ids.map(id => genresList.find(g => g.id === id)?.name).filter(Boolean).slice(0, 2)
    : [];

  return (
    <div className="group relative bg-gray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-red-900/20 hover:ring-2 hover:ring-red-600">
      {/* Poster Image */}
      <div className="aspect-[2/3] w-full overflow-hidden relative">
        <img 
          src={movie.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem'} 
          alt={movie.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        
        {/* Overlay Hover Actions */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4">
          <button 
            onClick={() => onPlay(movie.id)}
            className="bg-red-600 text-white p-4 rounded-full hover:bg-red-700 transform hover:scale-110 transition-all shadow-lg"
          >
            <Play fill="currentColor" size={24} />
          </button>
        </div>

        {/* Favorite Button */}
        <button 
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(movie); }}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full backdrop-blur-sm hover:bg-black/80 transition-all"
        >
          <Heart 
            size={20} 
            className={isFavorite ? "text-red-500 fill-red-500" : "text-white"} 
          />
        </button>
      </div>

      {/* Info Content */}
      <div className="p-4 space-y-2">
        <h3 className="font-bold text-white text-lg truncate" title={movie.title}>{movie.title}</h3>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <span className="flex items-center gap-1">
            <Calendar size={14} /> {releaseYear}
          </span>
          <span className="flex items-center gap-1 text-yellow-500">
            <Star size={14} fill="currentColor" /> {movie.vote_average.toFixed(1)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {movieGenres.map(g => (
            <span key={g} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{g}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
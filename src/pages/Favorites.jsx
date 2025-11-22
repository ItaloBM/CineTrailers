import React from "react";
import { Play, Trash2, Film, ArrowLeft } from "lucide-react";

export default function Favorites({
  favorites,
  onPlay,
  onToggleFavorite,
  onViewHome,
}) {
  // Se a lista estiver vazia, mostra essa mensagem bonita
  if (!favorites || favorites.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="bg-gray-800/50 p-6 rounded-full mb-6 animate-pulse">
          <Film size={64} className="text-gray-600" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">
          Sua lista está vazia
        </h2>
        <p className="text-gray-400 max-w-md mb-8">
          Você ainda não salvou nenhum filme. Volte para a tela inicial e clique
          no coração ❤️ para adicionar seus preferidos.
        </p>
        <button
          onClick={onViewHome}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transition-all hover:scale-105"
        >
          <ArrowLeft size={20} />
          Explorar Filmes
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-1 h-8 bg-red-600 rounded-full"></div>
        <h1 className="text-3xl font-bold text-white">Minha Lista</h1>
        <span className="bg-gray-800 text-gray-400 text-xs px-3 py-1 rounded-full border border-gray-700">
          {favorites.length} {favorites.length === 1 ? "filme" : "filmes"}
        </span>
      </div>

      {/* Grid de Favoritos */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {favorites.map((movie) => (
          <div
            key={movie.id}
            className="group relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-600 transition-all hover:-translate-y-1 shadow-lg"
          >
            {/* Poster */}
            <div className="aspect-[2/3] relative overflow-hidden">
              <img
                src={
                  movie.poster_path
                    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                    : "https://via.placeholder.com/500x750?text=Sem+Imagem"
                }
                alt={movie.title}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
              />

              {/* Overlay (Camada escura no hover) */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-4 p-4 backdrop-blur-sm">
                <button
                  onClick={() => onPlay(movie.movieId || movie.id)}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg shadow-red-600/20"
                >
                  <Play size={18} fill="currentColor" /> Assistir
                </button>

                <button
                  onClick={() => onToggleFavorite(movie)}
                  className="flex items-center gap-2 text-gray-300 hover:text-red-500 transition-colors transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75"
                >
                  <Trash2 size={18} /> Remover
                </button>
              </div>
            </div>

            {/* Informações */}
            <div className="p-4">
              <h3
                className="font-semibold text-white truncate mb-1"
                title={movie.title}
              >
                {movie.title}
              </h3>
              <div className="flex items-center justify-between text-xs text-gray-400">
                <span>{movie.release_date?.split("-")[0] || "Data N/A"}</span>
                <div className="flex items-center gap-1 text-yellow-500">
                  <span>★</span>
                  <span>{movie.vote_average?.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

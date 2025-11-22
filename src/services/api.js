const TMDB_BASE_URL = "https://api.themoviedb.org/3";

export const MovieService = {
  getUpcoming: async (apiKey) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/upcoming?api_key=${apiKey}&language=pt-BR&page=1`
    );
    if (!response.ok) throw new Error("Falha ao buscar filmes");
    return response.json();
  },
  getGenres: async (apiKey) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/genre/movie/list?api_key=${apiKey}&language=pt-BR`
    );
    if (!response.ok) throw new Error("Falha ao buscar gêneros");
    return response.json();
  },
  getVideos: async (movieId, apiKey) => {
    const response = await fetch(
      `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}&language=pt-BR`
    );
    let data = await response.json();

    // Fallback para inglês se não tiver trailer em PT-BR
    if (data.results.length === 0) {
      const responseEn = await fetch(
        `${TMDB_BASE_URL}/movie/${movieId}/videos?api_key=${apiKey}&language=en-US`
      );
      data = await responseEn.json();
    }
    return data;
  },
};

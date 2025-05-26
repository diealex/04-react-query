import axios from "axios";
import type { Movie } from "../types/movie";
const access_token = import.meta.env.VITE_TMDB_TOKEN;

interface MoviesHttpResponse {
  results: Movie[];
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MoviesHttpResponse> => {
  const response = await axios.get<MoviesHttpResponse>(
    `https://api.themoviedb.org/3/search/movie`,
    {
      params: {
        query: query,
        page,
      },
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    }
  );
  return response.data;
};

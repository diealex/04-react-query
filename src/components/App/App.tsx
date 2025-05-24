import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const notify = () => toast("No movies found for your request.");

  const openModal = (selectedMovie: Movie) => {
    setMovie(selectedMovie);
  };
  const closeModal = () => {
    setMovie(null);
  };

  const handleSubmit = async (query: string) => {
    try {
      setIsLoading(true);
      setIsError(false);
      const data = await fetchMovies(query);
      setMovies(data);
      if (data.length === 0) notify();
    } catch (error) {
      setIsError(true);
      toast.error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.app}>
      <Toaster />
      <SearchBar onSubmit={handleSubmit}></SearchBar>
      {isLoading && <Loader />}
      {movies.length > 0 && <MovieGrid movies={movies} onSelect={openModal} />}
      {isError && <ErrorMessage />}
      {movie && <MovieModal movie={movie!} onClose={closeModal} />}
    </div>
  );
}

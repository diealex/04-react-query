import css from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { useState } from "react";
import MovieGrid from "../MovieGrid/MovieGrid";
import { fetchMovies } from "../../services/movieService";
import type { Movie } from "../../types/movie";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import toast, { Toaster } from "react-hot-toast";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import ReactPaginate from "react-paginate";

export default function App() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>("");
  const [page, setPage] = useState(1);

  const notify = () => toast("No movies found for your request.");

  const openModal = (selectedMovie: Movie) => {
    setMovie(selectedMovie);
  };
  const closeModal = () => {
    setMovie(null);
  };

  const handleSubmit = (input: string) => {
    setQuery(input);
    setPage(1);
  };

  const { data, isLoading, isError } = useQuery({
    queryKey: ["query", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results;

  if (movies && movies.length === 0) notify();
  return (
    <div className={css.app}>
      <Toaster />
      <SearchBar onSubmit={handleSubmit}></SearchBar>
      {isLoading && <Loader />}
      {totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={1}
          forcePage={page - 1}
          onPageChange={({ selected }) => setPage(selected + 1)}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      {movies && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={openModal} />
      )}
      {isError && <ErrorMessage />}
      {movie && <MovieModal movie={movie!} onClose={closeModal} />}
    </div>
  );
}

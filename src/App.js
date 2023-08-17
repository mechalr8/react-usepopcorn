import { useState, useEffect } from "react";
import NavBar from "./components/NavBar";
import Main from "./components/Main";
import Logo from "./components/Logo";
import Search from "./components/Search";
import ResultCount from "./components/ResultCount";
import MovieList from "./components/MovieList";
import Box from "./components/Box";
import WatchedSummary from "./components/WatchedSummary";
import WatchedMoviesList from "./components/WatchedMoviesList";
import Loader from "./components/Loader";
import ErrorMessage from "./components/ErrorMessage";
import MovieDetails from "./components/MovieDetails";

const apiKey = process.env.REACT_APP_API_KEY;

const average = (arr) =>
    arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0).toFixed(1);

export default function App() {
    const [query, setQuery] = useState("");
    const [movies, setMovies] = useState([]);
    const [watched, setWatched] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [selectedId, setSelectedId] = useState(null);

    // useEffect(() => {
    //     fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=interstellar`)
    //         .then((res) => res.json())
    //         .then((data) => setMovies(data.Search));
    // }, []);

    function handleSelectMovie(id) {
        setSelectedId((selectedId) => (selectedId === id ? null : id));
    }

    function handleCloseMovie() {
        setSelectedId(null);
    }

    function handleAddWatched(movie) {
        setWatched((watched) => [...watched, movie]);
    }

    function handleDeleteWatched(id) {
        setWatched((watched) => watched.filter((movie) => movie.imdbID !== id));
    }

    useEffect(() => {
        const controller = new AbortController();
        async function fetchMovies() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${apiKey}&s=${query}`,
                    { signal: controller.signal }
                );
                if (!res.ok)
                    throw new Error(
                        "Something went wrong with Fetching movies"
                    );
                const data = await res.json();
                if (data.Response === "False")
                    throw new Error("Movies not found");
                setMovies(data.Search);
                setError("")
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
        if (query.length < 3) {
            setMovies([]);
            setError("");
            return;
        }
        fetchMovies();
        return () => {
            controller.abort();
        };
    }, [query]);

    return (
        <>
            <NavBar>
                <Logo />
                <Search query={query} setQuery={setQuery} />
                <ResultCount movies={movies} />
            </NavBar>
            <Main>
                <Box>
                    {isLoading ? (
                        <Loader />
                    ) : !error ? (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                        />
                    ) : (
                        <ErrorMessage message={error} />
                    )}
                    {/* {isLoading && <Loader />}
                    {!isLoading && !error && (
                        <MovieList
                            movies={movies}
                            onSelectMovie={handleSelectMovie}
                            onCloseMovie={handleCloseMovie}
                        />
                    )}
                    {error && <ErrorMessage message={error} />} */}
                </Box>
                <Box>
                    {selectedId ? (
                        <MovieDetails
                            selectedId={selectedId}
                            onCloseMovie={handleCloseMovie}
                            onAddWatched={handleAddWatched}
                            watched={watched}
                        />
                    ) : (
                        <>
                            <WatchedSummary
                                watched={watched}
                                average={average}
                            />
                            <WatchedMoviesList
                                watched={watched}
                                onSelectMovie={handleSelectMovie}
                                onDeleteWatched={handleDeleteWatched}
                            />
                        </>
                    )}
                </Box>
            </Main>
        </>
    );
}

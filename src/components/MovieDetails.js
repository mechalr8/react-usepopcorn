import React, { useEffect, useState } from "react";
import StarRating from "./StarRating";
import Loader from "./Loader";
import ErrorMessage from "./ErrorMessage";
const apiKey = process.env.REACT_APP_API_KEY;

const MovieDetails = ({ selectedId, onCloseMovie, onAddWatched, watched }) => {
    const [movieDetails, setMovieDetails] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const [userRating, setUserRating] = useState("");
    const isWatched = watched.map((movie) => movie.imdbID).includes(selectedId);
    const watchedUSerRating = watched.find(
        (movie) => movie.imdbID === selectedId
    )?.userRating;
    const {
        Title: title,
        Poster: poster,
        Runtime: runtime,
        imdbRating,
        Year: year,
        Plot: plot,
        Released: released,
        Actors: actors,
        Director: director,
        Genre: genre,
    } = movieDetails;

    function handleAdd() {
        const newWatchedMovie = {
            imdbID: selectedId,
            title,
            year,
            poster,
            imdbRating: Number(imdbRating),
            runtime: Number(runtime.split(" ").at(0)),
            userRating,
        };
        onAddWatched(newWatchedMovie);
        onCloseMovie();
    }

    function updateUserRating() {
        watched.find((movie) => movie.imdbID === selectedId).userRating =
            userRating;
        onCloseMovie();
    }

    useEffect(() => {
      function callBack(e){
        if (e.code === "Escape") {
            onCloseMovie();
        }
      }
        document.addEventListener("keydown", callBack);
        return () => {
          document.removeEventListener("keydown", callBack)
        }
    }, [onCloseMovie]);

    useEffect(() => {
        const controler = new AbortController();
        async function fetchMovieDetails() {
            try {
                setIsLoading(true);
                setError("");
                const res = await fetch(
                    `http://www.omdbapi.com/?apikey=${apiKey}&i=${selectedId}`,
                    { signal: controler.signal }
                );
                if (!res.ok)
                    throw new Error(
                        "Something went wrong with Fetching movie details"
                    );
                const data = await res.json();
                console.log(data);
                setMovieDetails(data);
                setError("");
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message);
                }
            } finally {
                setIsLoading(false);
            }
        }
        fetchMovieDetails();
        return () => {
            controler.abort();
        };
    }, [selectedId]);

    useEffect(() => {
        if (!title) return;
        document.title = `Movie | ${title}`;
        return () => {
            document.title = "usePopcorn";
        };
    }, [title]);
    return (
        <div className='details'>
            {isLoading ? (
                <Loader />
            ) : !error ? (
                <>
                    <header>
                        <button className='btn-back' onClick={onCloseMovie}>
                            &larr;
                        </button>
                        <img
                            src={poster}
                            alt={`Poster of ${movieDetails} movie`}
                        />
                        <div className='details-overview'>
                            <h2>{title}</h2>
                            <p>
                                {released} &bull; {runtime}
                            </p>
                            <p>{genre}</p>
                            <p>
                                <span>⭐️</span>
                                {imdbRating} IMDb rating
                            </p>
                        </div>
                    </header>
                    <section>
                        <div className='rating'>
                            {!isWatched ? (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className='btn-add'
                                            onClick={handleAdd}
                                        >
                                            + Add to List
                                        </button>
                                    )}
                                </>
                            ) : (
                                <>
                                    <StarRating
                                        maxRating={10}
                                        size={24}
                                        defaultRating={watchedUSerRating}
                                        onSetRating={setUserRating}
                                    />
                                    {userRating > 0 && (
                                        <button
                                            className='btn-add'
                                            onClick={updateUserRating}
                                        >
                                            Update user rating
                                        </button>
                                    )}
                                </>
                            )}
                        </div>
                        <p>
                            <em>{plot}</em>
                        </p>
                        <p>Starring {actors}</p>
                        <p>Directed by {director}</p>
                    </section>
                </>
            ) : (
                <ErrorMessage message={error} />
            )}
        </div>
    );
};

export default MovieDetails;

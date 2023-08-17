import React from "react";
import WatchedMovie from "./WatchedMovie";

const WatchedMoviesList = ({watched, onDeleteWatched, onSelectMovie}) => {
    return (
        <ul className='list list-movies'>
            {watched.map((movie) => (
                <WatchedMovie key={movie.imdbID} movie={movie} onDeleteWatched={onDeleteWatched} onSelectMovie={onSelectMovie}/>
            ))}
        </ul>
    );
};

export default WatchedMoviesList;

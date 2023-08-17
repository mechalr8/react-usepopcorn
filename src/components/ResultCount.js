import React from "react";

const ResultCount = ({ movies }) => {
    return (
        <p className='num-results'>
            Found <strong>{movies.length}</strong> results
        </p>
    );
};

export default ResultCount;
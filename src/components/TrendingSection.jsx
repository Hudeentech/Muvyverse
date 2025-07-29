
import React, { useState, useEffect } from 'react';
import TrendingCardComponent from './static/TrendingMovieCard.jsx';
// TMDB genre mapping
const GENRE_MAP = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Science Fiction',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export default function TrendingSectionComponent() {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const API_BASE_URL = 'https://api.themoviedb.org/3/';
    const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
    const API_OPTIONS = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        accept: 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
    };
    const fetchTrending = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = `${API_BASE_URL}/trending/movie/day?language=en-US`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status:${response.status}`);
        }
        const result = await response.json();
        setTrending(result.results ? result.results.slice(0, 15) : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
  }, []);



  return (
    <section className="h-fit py-6 mx-auto w-full flex flex-col justify-center overflow-x-hidden items-start bg-gradient-to-b from-red-900 from-10% to-80% to-black">
      <h1 className='pt-6 text-2xl text-left px-4 font-bold capitalize '>trending movies</h1>

      {loading && <p className="text-center">Loading...</p>}
      {error && <p className="text-center text-red-500">Error: {error}</p>}

      {!loading && !error && trending.length > 0 && (
        <div className="relative gap-4 bg-transparent w-[100%] lg:h-fit ps-4 md:m-4 rounded-lg flex flex-col lg:flex-row items-center justify-start">
          <div className='flex relative isolate flex-row justify-start items-center w-[100%] lg:w-[90%] overflow-x-auto lg:overflow-x-scroll gap-2 '>
            {trending.map(movie => (
              <TrendingCardComponent
                key={movie.id}
                id={movie.id}
                title={movie.title}
                image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                rating={movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

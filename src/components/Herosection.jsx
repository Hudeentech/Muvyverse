

import React, { useEffect, useState, useRef } from 'react';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const API_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`,
  },
};

export default function HeroSectionComponent() {
  const [trending, setTrending] = useState([]);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    async function fetchTrending() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/trending/movie/week`, API_OPTIONS);
        if (!res.ok) throw new Error('Failed to fetch trending movies');
        const data = await res.json();
        setTrending(data.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchTrending();
  }, []);

  useEffect(() => {
    if (trending.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrent((prev) => (prev + 1) % trending.length);
      }, 5000);
      return () => clearInterval(intervalRef.current);
    }
  }, [trending]);

  if (loading) {
    return (
      <div className="w-full h-[70dvh] flex items-center justify-center bg-[#181818]">
        <span className="text-yellow-400 text-2xl font-bold">Loading trending movies...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-[70dvh] flex items-center justify-center bg-[#181818]">
        <span className="text-red-500 text-xl">{error}</span>
      </div>
    );
  }

  if (!trending.length) {
    return null;
  }

  const movie = trending[current];
  return (
    <div className="w-full h-[70dvh] relative flex items-center justify-center overflow-hidden bg-black">
      <img
        src={movie.backdrop_path ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}` : ''}
        alt={movie.title}
        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-all duration-700"
        draggable="false"
      />
      <div className="relative z-10 flex flex-col items-center justify-center w-full h-full bg-gradient-to-t from-black/80 via-black/40 to-transparent px-4">
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-yellow-400 text-center drop-shadow-lg mb-4">
          {movie.title}
        </h1>
        <p className="max-w-2xl text-center text-lg sm:text-xl text-white/90 mb-6 line-clamp-4">
          {movie.overview}
        </p>
        <div className="flex flex-row gap-4 items-center">
          <span className="bg-yellow-500/90 text-black font-bold px-4 py-2 rounded-full text-lg shadow">
            {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
          </span>
          <span className="bg-black/70 text-yellow-300 font-semibold px-3 py-1 rounded-full">
            ⭐ {movie.vote_average?.toFixed(1)}
          </span>
        </div>
      </div>
      {/* Slider controls */}
      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-yellow-500/80 text-white hover:text-black rounded-full p-3 text-2xl z-20 transition"
        onClick={() => setCurrent((current - 1 + trending.length) % trending.length)}
        aria-label="Previous"
      >
        &#8592;
      </button>
      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-yellow-500/80 text-white hover:text-black rounded-full p-3 text-2xl z-20 transition"
        onClick={() => setCurrent((current + 1) % trending.length)}
        aria-label="Next"
      >
        &#8594;
      </button>
      {/* Dots */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
        {trending.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full ${idx === current ? 'bg-yellow-400' : 'bg-white/40'} transition-all`}
          />
        ))}
      </div>
    </div>
  );
}
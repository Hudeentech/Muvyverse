import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MovieCardComponent from './static/MovieCard.jsx';
import { CategoryComponents } from './static/Cateogory.jsx';
import SearchComponent from './static/SearchComponent.jsx';
import images from '../assets/img.js';



const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Trending', value: 'trending' },
  { label: 'Latest', value: 'latest' },
  { label: '2024', value: 2024 },
  { label: '2023', value: 2023 },
  { label: '2022', value: 2022 },
  { label: '2021', value: 2021 },
];

// Genre mapping from TMDB genre ids to names
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
  878: 'SciFi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};



export default function MovieSectionComponent({ title, Stitle, description, image }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [genre, setGenre] = useState('all');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

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
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const endpoint = `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status:${response.status}`);
        }
        const result = await response.json();
        setData(result.results || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Get all genres from data
  const allGenres = Array.from(
    new Set(
      data.flatMap(movie => (movie.genre_ids || [])).filter(Boolean)
    )
  );
  const genreOptions = [
    { label: 'All', value: 'all' },
    ...allGenres.map(id => ({ label: GENRE_MAP[id] || id, value: id }))
  ];

  // Filtering logic
  const filteredData = data.filter((movie) => {
    // Search by title
    const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase());
    // Filter by trending, year, or all
    let matchesFilter = true;
    if (filter === 'trending') {
      matchesFilter = movie.popularity && movie.popularity > 100; // adjust threshold as needed
    } else if (filter === 'latest') {
      const maxYear = Math.max(...data.map(m => m.release_date ? parseInt(m.release_date.split('-')[0]) : 0));
      matchesFilter = movie.release_date && parseInt(movie.release_date.split('-')[0]) === maxYear;
    } else if (filter !== 'all') {
      matchesFilter = movie.release_date && parseInt(movie.release_date.split('-')[0]) === filter;
    }
    // Genre filter
    let matchesGenre = true;
    if (genre !== 'all') {
      matchesGenre = movie.genre_ids && movie.genre_ids.includes(genre);
    }
    return matchesSearch && matchesFilter && matchesGenre;
  });

  // Group filtered movies by genre
  const genreGroups = {};
  filteredData.forEach(movie => {
    const uniqueGenres = Array.from(new Set(movie.genre_ids || []));
    uniqueGenres.forEach(genreId => {
      const genreName = GENRE_MAP[genreId] || 'Other';
      if (!genreGroups[genreName]) genreGroups[genreName] = [];
      if (!genreGroups[genreName].some(m => m.id === movie.id)) {
        genreGroups[genreName].push(movie);
      }
    });
  });

  if (loading) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <section className="h-fit w-full flex relative p-3 isolate overflow-hidden flex-col justify-center items-center ">

      {/* Search Bar */}
      <div className="w-full flex justify-center my-4">
        <SearchComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
        />
      </div>

      {/* Filter Buttons */}
      <div className="w-full flex flex-row gap-2 justify-start mb-4 overflow-x-auto scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800 md:overflow-x-visible">
        {filterOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-4 py-2 rounded ${filter === opt.value ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-yellow-500'}`}
            onClick={() => setFilter(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Genre Filter */}
      <div className=" w-full flex flex-row gap-2 justify-start items-start mb-4 overflow-scroll overflow-x-scroll scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-800 md:overflow-x-visible">
        {genreOptions.map(opt => (
          <button
            key={opt.value}
            className={`px-2 block py-2 rounded ${genre === opt.value ? 'bg-yellow-500 text-gray-900' : 'bg-gray-700 text-yellow-500'}`}
            onClick={() => setGenre(opt.value)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Grouped by genre */}
      <div className="w-full">
        {Object.entries(genreGroups).filter(([_, movies]) => movies.length > 0).map(([genreName, movies]) => (
          <div key={genreName} className="mb-8">
            <h2 className="text-xl font-semibold px-4 mb-2 text-yellow-400">{genreName}</h2>
            <div className="flex flex-row gap-4 w-full overflow-x-auto scrollbar-thin  scrollbar-thumb-yellow-400 scrollbar-track-gray-800 md:grid md:grid-cols-4 md:overflow-x-visible">
              {movies.map((movie, idx) => (
                <div className=" md:min-w-0 flex-shrink-0 md:flex-shrink md:w-auto" key={movie.id || idx}>
                  <MovieCardComponent
                    id={movie.id}
                    title={movie.title}
                    image={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
                    rating={movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
                    year={movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
        {filteredData.length === 0 && <p className="col-span-full text-center">No movies found.</p>}
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import MovieCard from '../components/static/MovieCard';

const API_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = 'YOUR_TMDB_API_KEY'; // Replace with your actual TMDB API key

export default function SearchResultsPage() {
  const { query } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResults() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE_URL}/search/movie?api_key=${API_KEY}&query=${encodeURIComponent(query)}`);
        const data = await res.json();
        setResults(data.results || []);
      } catch (err) {
        setError('Failed to fetch search results.');
      } finally {
        setLoading(false);
      }
    }
    fetchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[#181818] pt-24 px-4">
      <h2 className="text-2xl font-bold text-yellow-400 mb-6">Results for "{query}"</h2>
      {loading && <div className="text-center text-yellow-400">Loading...</div>}
      {error && <div className="text-center text-red-500">{error}</div>}
      {!loading && !error && results.length === 0 && (
        <div className="text-center text-gray-400">No results found.</div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {results.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </div>
  );
}

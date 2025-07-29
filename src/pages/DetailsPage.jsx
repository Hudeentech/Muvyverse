import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Nav from '../components/NavSection';
export default function DetailsPage() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [related, setRelated] = useState([]);
  const [trailer, setTrailer] = useState(null);
  const [showStreaming, setShowStreaming] = useState(true);

  const streamingLinks = [
    { name: 'Netflix', url: `https://www.netflix.com/search?q=${encodeURIComponent(movie?.title || '')}` },
    { name: 'Amazon Prime', url: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodeURIComponent(movie?.title || '')}` },
    { name: 'Hulu', url: `https://www.hulu.com/search?q=${encodeURIComponent(movie?.title || '')}` },
    { name: 'Google Search', url: `https://www.google.com/search?q=watch+${encodeURIComponent(movie?.title || '')}+online` },
  ];
  const downloadLinks = [
    { name: 'Google Search', url: `https://www.google.com/search?q=download+${encodeURIComponent(movie?.title || '')}+movie` },
    { name: 'The Pirate Bay', url: `https://thepiratebay.org/search.php?q=${encodeURIComponent(movie?.title || '')}` },
    { name: 'FZMovies', url: `https://fzmovies.live/csearch.php?search=${encodeURIComponent(movie?.title || '')}` },
  ];

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
    const fetchMovie = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch movie details
        const endpoint = `${API_BASE_URL}/movie/${id}`;
        const response = await fetch(endpoint, API_OPTIONS);
        if (!response.ok) {
          throw new Error(`HTTP Error! Status:${response.status}`);
        }
        const result = await response.json();
        setMovie(result);

        // Fetch related movies (recommendations)
        const recEndpoint = `${API_BASE_URL}/movie/${id}/recommendations`;
        const recResponse = await fetch(recEndpoint, API_OPTIONS);
        if (recResponse.ok) {
          const recResult = await recResponse.json();
          setRelated(recResult.results ? recResult.results.slice(0, 8) : []);
        } else {
          setRelated([]);
        }

        // Fetch trailer (YouTube)
        const videoEndpoint = `${API_BASE_URL}/movie/${id}/videos`;
        const videoResponse = await fetch(videoEndpoint, API_OPTIONS);
        if (videoResponse.ok) {
          const videoResult = await videoResponse.json();
          const yt = videoResult.results?.find(v => v.site === 'YouTube' && v.type === 'Trailer');
          setTrailer(yt ? `https://www.youtube.com/watch?v=${yt.key}` : null);
        } else {
          setTrailer(null);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  if (loading) return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center p-4 text-gray-50 bg-[#181818]">
      <div className="flex flex-col items-center justify-center">
        <svg className="animate-spin h-10 w-10 text-yellow-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
        </svg>
        <p className="text-lg font-semibold">Fetching movie details...</p>
      </div>
    </section>
  );
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;
  if (!movie) return <p className="text-center">Movie not found.</p>;

  return (
    <section className="min-h-screen mt-6 w-full flex flex-col items-center justify-center p-0 text-gray-50 bg-[#181818]">
      <Nav />
      <div className="w-full h-auto flex flex-col md:flex-row items-center justify-center bg-[#232323] px-4">
        <img
          src={movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : ''}
          alt={movie.title}
          className="w-full md:w-1/3 h-[80dvh] md:h-[80vh] rounded-lg object-contain lg:object-cover p-2"
        />
        <div className="flex-1 flex flex-col gap-4 p-2 md:p-8 h-full justify-center">
          <h1 className="text-4xl font-bold mb-2">{movie.title}</h1>
          <p className="text-lg text-gray-300 italic">{movie.tagline}</p>
          <p className="text-base mb-4">{movie.overview}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            <span className="bg-yellow-500 text-gray-900 px-3 py-1 rounded">Rating: {movie.vote_average?.toFixed(1)}</span>
            <span className="bg-gray-700 px-3 py-1 rounded">Year: {movie.release_date ? movie.release_date.split('-')[0] : 'N/A'}</span>
            <span className="bg-gray-700 px-3 py-1 rounded">Runtime: {movie.runtime} min</span>
            <span className="bg-gray-700 px-3 py-1 rounded">Genres: {movie.genres?.map(g => g.name).join(', ')}</span>
          </div>

      {/* Streaming/Download Links Toggle Section */}
      <section className="w-full   mt-8">
        <div className="flex justify-start mb-4">
          <button
            className={`px-4 py-2 rounded-l font-bold transition-colors ${showStreaming ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-yellow-400'}`}
            onClick={() => setShowStreaming(true)}
          >
            Streaming Links
          </button>
          <button
            className={`px-4 py-2 rounded-r font-bold transition-colors ${!showStreaming ? 'bg-yellow-500 text-black' : 'bg-gray-700 text-yellow-400'}`}
            onClick={() => setShowStreaming(false)}
          >
            Download Links
          </button>
        </div>
        <div className="flex flex-col gap-3 items-center">
          {showStreaming
            ? streamingLinks.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition text-center"
                >
                  {link.name}
                </a>
              ))
            : downloadLinks.map(link => (
                <a
                  key={link.url}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-gray-700 text-yellow-400 px-4 py-2 rounded font-semibold hover:bg-gray-600 transition text-center"
                >
                  {link.name}
                </a>
              ))}
        </div>
      </section>

          <Link to="/" className="mt-8 inline-block text-yellow-500 hover:underline">&larr; Back to Home</Link>
        </div>
      </div>

     {/* Trailer Section - full width */}
      {trailer && trailer.includes('youtube.com/watch?v=') && (
        <section className="w-full mt-8 px-0">
          <h2 className="text-2xl font-bold text-red-500 mb-4 text-center">Watch Trailer</h2>
          <div className="w-full aspect-video rounded-lg overflow-hidden">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.split('v=')[1]}`}
              title="Movie Trailer"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-[95%] mx-auto h-[90%] border-0"
            ></iframe>
          </div>
        </section>
      )}



      {/* Related Movies Section */}
      {related.length > 0 && (
        <div className="w-full max-w-6xl mx-auto mt-8 px-4">
          <h2 className="text-2xl font-bold mb-4 text-yellow-400">Related Movies</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {related.map(rmovie => (
              <Link key={rmovie.id} to={`/movie/${rmovie.id}`} className="bg-[#232323] rounded-lg p-2 hover:bg-[#333] transition-colors flex flex-col items-center">
                <div className="w-full aspect-[2/3] flex items-center justify-center overflow-hidden mb-2">
                  <img
                    src={rmovie.poster_path ? `https://image.tmdb.org/t/p/w500${rmovie.poster_path}` : ''}
                    alt={rmovie.title}
                    className="w-full h-full rounded"
                    style={{objectFit: 'contain', maxHeight: '100%'}}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-base font-semibold text-yellow-300">{rmovie.title}</h3>
                  <p className="text-xs text-gray-400">{rmovie.release_date ? rmovie.release_date.split('-')[0] : 'N/A'}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}


    </section>
  );
}

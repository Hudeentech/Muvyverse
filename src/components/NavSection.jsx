import SearchComponent from './static/SearchComponent';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Nav() {
  const [searchTerm, setSearchTerm] = useState('');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
  };

  const handleNavClick = (route) => {
    navigate(route);
    setMobileNavOpen(false);
  };

  return (
    <nav className="fixed top-0 left-0 z-50 w-full bg-[#181818cc] backdrop-blur-xl flex items-center justify-between px-6 py-3 shadow-lg border-b border-[#232323]">
      {/* Logo and Brand */}
      <div className="flex items-center gap-3 select-none">
        <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 shadow-lg">
          <i className="fas fa-film text-white text-xl"></i>
        </span>
        <span className="text-2xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-tight">MovieVerse</span>
      </div>

      {/* Search Icon */}
      <button
        className="block md:hidden p-2 rounded-full hover:bg-yellow-500/20 transition-colors"
        onClick={() => setShowSearchModal(true)}
      >
        <i className="fas fa-search text-xl text-yellow-400"></i>
      </button>

      {/* Search Bar (desktop only) */}
      <div className="hidden md:block w-1/3 max-w-md">
        <SearchComponent
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onSearch={handleSearch}
        />
      </div>

      {/* Navigation Links */}
      <ul className="hidden md:flex items-center gap-6 text-lg font-medium">
        <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/')}>Home</li>
        <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/about')}>About</li>
        <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/contact')}>Contact</li>
      </ul>

      {/* Mobile Menu Button */}
      <button className="block md:hidden p-2 rounded-full hover:bg-yellow-500/20 transition-colors" onClick={() => setMobileNavOpen(true)}>
        <i className="fas fa-bars text-2xl text-yellow-400"></i>
      </button>

      {/* Mobile Nav Slide-in */}
      {mobileNavOpen && (
        <div className="fixed top-0 right-0 z-50 h-screen w-3/4 max-w-xs bg-[#232323] shadow-xl flex flex-col pt-8 px-6 transition-transform duration-300 animate-slide-in">
          <button className="absolute top-4 right-4 p-2 rounded-full hover:bg-yellow-500/20 transition-colors" onClick={() => setMobileNavOpen(false)}>
            <i className="fas fa-times text-2xl text-yellow-400"></i>
          </button>
          <ul className="flex flex-col gap-8 text-lg font-bold mt-12">
            <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/')}>Home</li>
            <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/about')}>About</li>
            <li className="hover:text-yellow-400 transition-colors cursor-pointer" onClick={() => handleNavClick('/contact')}>Contact</li>
          </ul>
        </div>
      )}

      {/* Search Modal */}
      {showSearchModal && (
        <div className="fixed top-16 left-0 w-full z-40 flex justify-center">
          <div className="bg-[#232323] rounded-lg shadow-xl p-6 w-full max-w-md mx-auto border border-yellow-500 flex flex-col items-center">
            <div className="flex justify-between items-center w-full mb-4">
              <h3 className="text-lg font-bold text-yellow-400">Search Movies</h3>
              <button
                className="p-2 rounded-full hover:bg-yellow-500/20 transition-colors"
                onClick={() => setShowSearchModal(false)}
              >
                <i className="fas fa-times text-xl text-yellow-400"></i>
              </button>
            </div>
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') { handleSearch(); setShowSearchModal(false); } }}
              className="px-3 py-2 rounded bg-[#181818] text-white border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 w-full"
              placeholder="Search movies..."
              autoFocus
            />
            <button
              className="mt-4 w-full bg-yellow-500 text-black px-4 py-2 rounded font-semibold hover:bg-yellow-400 transition"
              onClick={() => { handleSearch(); setShowSearchModal(false); }}
            >
              Search
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}

// Add slide-in animation
// In your global CSS (e.g., index.css or App.css), add:
// @keyframes slide-in { from { transform: translateX(100%); } to { transform: translateX(0); } }
// .animate-slide-in { animation: slide-in 0.3s ease-out; }
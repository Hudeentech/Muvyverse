
import { ButtonSolid } from "./Button";

function SearchComponent({ searchTerm, setSearchTerm, onSearch }) {
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && onSearch) {
      onSearch();
    }
  };
  return (
    <div className="flex flex-row border rounded-lg border-yellow-500 items-center space-x-2 bg-[#232323] px-2 py-1">
      <i className="fa-solid fa-search p-2 rounded-full text-yellow-500"></i>
      <input
        type="text"
        placeholder="Search movies..."
        onChange={(e) => setSearchTerm(e.target.value)}
        value={searchTerm}
        onKeyDown={handleKeyDown}
        className="outline-0 border-0 w-full bg-transparent rounded-lg text-white placeholder:text-yellow-300 px-2 py-1"
      />
      <button
        className="font-normal text-base"
        onClick={onSearch}
        aria-label="Search"
      >
        <ButtonSolid text="Search" />
      </button>
    </div>
  );
}

export default SearchComponent;

import React, { useState } from "react";

const SearchBar = ({ onSearch, placeholder = "Search students, courses, or activities..." }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // --- Neumorphism Helper Classes ---

  // Input Field: Sunken effect for data entry
  const neoInputClass = `
    flex-1 p-3 text-green-900 placeholder-green-400 bg-[#e6fae6] rounded-l-xl
    border-none focus:outline-none 
    shadow-[inset_4px_4px_8px_#b0d9b0,inset_-4px_-4px_8px_#ffffff]
    transition-all duration-300
    focus:ring-2 focus:ring-green-500/50
  `;

  // Search Button: Raised and pressable effect
  const neoButtonClass = `
    px-5 py-3 rounded-r-xl font-bold text-white text-lg
    bg-[#5bab5b]
    transition-all duration-300
    shadow-[-3px_3px_8px_rgba(90,171,91,0.4),3px_-3px_8px_rgba(255,255,255,0.7)] 
    hover:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]
    active:shadow-[inset_4px_4px_8px_rgba(0,0,0,0.1),inset_-4px_-4px_8px_rgba(255,255,255,0.8)]
  `;

  return (
    <form className="flex w-full max-w-2xl mx-auto" onSubmit={handleSearch}>
      {/* Search Input (Sunken) */}
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={handleChange}
        className={neoInputClass}
      />
      
      {/* Search Button (Raised) */}
      <button
        type="submit"
        className={neoButtonClass}
      >
        <span className="text-xl">🔍</span>
      </button>
    </form>
  );
};

export default SearchBar;
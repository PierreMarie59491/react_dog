const SearchInput = ({ searchTerm, handleInputChange, handleSearch }) => {
    return (
      <div className="flex gap-2 items-center mb-4">
        <input
          type="text"
          placeholder="Entrez le nom d'une race..."
          value={searchTerm}
          onChange={(e) => handleInputChange(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 flex-1"
        />
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
        >
          Rechercher
        </button>
      </div>
    );
  };
  
  export default SearchInput;
  
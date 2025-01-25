import React from 'react';

const BreedSuggestions = ({ filteredBreeds, handleBreedSelect }) => {
  const isBreedInfoComplete = (breed) =>
    breed.temperament && breed.life_span && breed.origin;

  return (
    <div className="bg-gray-100 p-4 rounded shadow mt-4">
      {filteredBreeds.map((breed) => {
        const hasCompleteInfo = isBreedInfoComplete(breed);
        return (
          <div
            key={breed.id}
            className={`cursor-pointer p-2 rounded mb-2 ${
              hasCompleteInfo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}
            onClick={() => handleBreedSelect(breed)}
          >
            {breed.name}
          </div>
        );
      })}
    </div>
  );
};

export default BreedSuggestions;

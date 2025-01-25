import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import SearchInput from './SearchInput';
import BreedSuggestions from './BreedSuggestions';
import DogImageGallery from './DogImageGallery';
import BreedDetails from './BreedDetails';

const DogSearch = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [breeds, setBreeds] = useState([]);
  const [filteredBreeds, setFilteredBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState(null);
  const [selectedBreedImage, setSelectedBreedImage] = useState(null);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Charger les races dès le montage
  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds')
      .then((response) => setBreeds(response.data))
      .catch((error) => console.error('Erreur lors de la récupération des races:', error));
  }, []);

  // Mettre à jour les suggestions de races
  const handleInputChange = (input) => {
    setSearchTerm(input);
    if (input) {
      const suggestions = breeds.filter((breed) =>
        breed.name.toLowerCase().includes(input.toLowerCase())
      );
      setFilteredBreeds(suggestions);
    } else {
      setFilteredBreeds([]);
    }
  };

  // Gérer la sélection d'une race
  const handleBreedSelect = (breed) => {
    setSearchTerm(breed.name);
    setFilteredBreeds([]);
    setSelectedBreed(breed);
    fetchBreedImage(breed.id);
  };

  // Rechercher les images associées à une race
  const fetchBreedImage = (breedId) => {
    axios
      .get(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setSelectedBreedImage(response.data[0].url);
        }
      })
      .catch((error) => console.error('Erreur lors de la récupération de l\'image:', error));
  };

  // Recherche des images basées sur le texte entré
  const handleSearch = () => {
    if (!searchTerm) return;

    setLoading(true);
    setErrorMessage('');
    const matchingBreeds = breeds.filter((breed) =>
      breed.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (matchingBreeds.length === 0) {
      setImages([]);
      setErrorMessage('Aucune race correspondante trouvée.');
      setLoading(false);
    } else {
      const breedIds = matchingBreeds.map((breed) => breed.id).join(',');
      axios
        .get(`https://api.thedogapi.com/v1/images/search?limit=10&breed_id=${breedIds}`)
        .then((response) => {
          const imagesWithBreeds = response.data.map((image) => ({
            url: image.url,
            breed: image.breeds && image.breeds[0] ? image.breeds[0].name : '',
          }));
          setImages(imagesWithBreeds);
        })
        .catch(() => setErrorMessage('Erreur lors de la récupération des images.'))
        .finally(() => setLoading(false));
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-4">Recherche de chiens</h1>
      <SearchInput
        searchTerm={searchTerm}
        handleInputChange={handleInputChange}
        handleSearch={handleSearch}
      />
      <BreedSuggestions
        filteredBreeds={filteredBreeds}
        handleBreedSelect={handleBreedSelect}
      />
      <DogImageGallery images={images} loading={loading} errorMessage={errorMessage} />
      {selectedBreed && (
        <BreedDetails breed={selectedBreed} image={selectedBreedImage} />
      )}
    </div>
  );
};

export default DogSearch;

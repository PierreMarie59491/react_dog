import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './DogCarousel.css';

const DogSearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // Texte entré dans la barre de recherche
  const [images, setImages] = useState([]); // Images des chiens
  const [loading, setLoading] = useState(false); // Indicateur de chargement
  const [breeds, setBreeds] = useState([]); // Liste complète des races
  const [filteredBreeds, setFilteredBreeds] = useState([]); // Suggestions de races
  const [errorMessage, setErrorMessage] = useState(''); // Message en cas d'absence de résultats
  const [selectedBreed, setSelectedBreed] = useState(null); // Détails de la race sélectionnée
  const [selectedBreedImage, setSelectedBreedImage] = useState(null); // Image de la race sélectionnée

  // Charger toutes les races dès le montage du composant
  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds')
      .then((response) => setBreeds(response.data))
      .catch((error) => console.error('Erreur lors de la récupération des races:', error));
  }, []);

  // Gérer la recherche
  const handleSearch = () => {
    if (!searchTerm) return; // Ne rien faire si le champ de recherche est vide

    setLoading(true);
    setErrorMessage(''); // Réinitialiser le message d'erreur

    // Filtrer les races correspondant partiellement au texte recherché et ayant des informations complètes
    const matchingBreeds = breeds.filter((breed) => {
      return (
        breed.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        breed.temperament && // Vérifie que le tempérament est présent
        breed.life_span &&  // Vérifie que l'espérance de vie est présente
        breed.origin // Vérifie que l'origine est présente
      );
    });

    if (matchingBreeds.length === 0) {
      // Aucun résultat trouvé
      setImages([]);
      setErrorMessage('Aucune race correspondante trouvée.');
      setLoading(false);
    } else {
      // Récupérer les images pour les races correspondantes
      const breedIds = matchingBreeds.map((breed) => breed.id).join(',');
      axios
        .get(`https://api.thedogapi.com/v1/images/search?limit=10&breed_id=${breedIds}`)
        .then((response) => {
          const imagesWithBreeds = response.data.map((image) => ({
            url: image.url,
            breed: image.breeds && image.breeds[0] ? image.breeds[0].name : '',
            breedId: image.breeds && image.breeds[0] ? image.breeds[0].id : null,
          }));
          setImages(imagesWithBreeds);
        })
        .catch((error) => {
          console.error('Erreur lors de la récupération des images:', error);
          setErrorMessage('Une erreur est survenue lors de la récupération des images.');
        })
        .finally(() => setLoading(false));
    }
  };

  // Mettre à jour les suggestions de races en fonction du texte entré
  const handleInputChange = (e) => {
    const input = e.target.value;
    setSearchTerm(input);

    if (input) {
      const suggestions = breeds.filter((breed) => {
        return (
          breed.name.toLowerCase().includes(input.toLowerCase()) &&
          breed.temperament && // Vérifie que le tempérament est présent
          breed.life_span &&  // Vérifie que l'espérance de vie est présente
          breed.origin // Vérifie que l'origine est présente
        );
      });
      setFilteredBreeds(suggestions);
    } else {
      setFilteredBreeds([]);
    }
  };

  // Fonction pour afficher les détails de la race sélectionnée lorsque l'utilisateur choisit une race
  const handleBreedSelect = (breed) => {
    setSearchTerm(breed.name); // Met à jour le champ de recherche avec le nom de la race
    setFilteredBreeds([]); // Efface les suggestions
    setSelectedBreed(breed); // Sauvegarde les détails de la race sélectionnée

    // Recherche de l'image pour la race sélectionnée
    const breedId = breed.id;
    axios
      .get(`https://api.thedogapi.com/v1/images/search?breed_id=${breedId}`)
      .then((response) => {
        if (response.data.length > 0) {
          setSelectedBreedImage(response.data[0].url); // Récupère la première image associée à la race
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération de l\'image de la race:', error);
      });

    handleSearch(); // Effectue la recherche pour afficher les images associées à la race
  };

  return (
    <div>
      <h1>Recherche de chiens</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Entrez le nom d'une race..."
          value={searchTerm}
          onChange={handleInputChange}
          className="search-input"
        />
        <button onClick={handleSearch} className="search-button">
          Rechercher
        </button>

        {filteredBreeds.length > 0 && (
          <div
            style={{
              backgroundColor: '#f8f8f8',
              border: '1px solid #ddd',
              marginTop: '10px',
              padding: '10px',
              borderRadius: '5px',
              maxHeight: '150px',
              overflowY: 'auto',
              width: '300px',
            }}
          >
            {filteredBreeds.slice(0, 5).map((breed) => (
              <div
                key={breed.id}
                className="suggestion-item"
                onClick={() => handleBreedSelect(breed)} // Sélectionner la race
              >
                {breed.name}
              </div>
            ))}
            {filteredBreeds.length > 5 && (
              <p style={{ fontSize: '12px', color: '#555' }}>Plus de résultats disponibles...</p>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <p>Chargement des images...</p>
      ) : errorMessage ? (
        <p>{errorMessage}</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {images.map((image, index) => (
            <div
              key={index}
              style={{
                margin: '10px',
                textAlign: 'center',
                border: '1px solid #ddd',
                borderRadius: '5px',
                padding: '10px',
              }}
            >
              <img
                src={image.url}
                alt="dog"
                style={{
                  width: '200px',
                  height: '200px',
                  objectFit: 'cover',
                  borderRadius: '5px',
                }}
              />
              <p style={{ marginTop: '10px' }}>{image.breed}</p>
            </div>
          ))}
        </div>
      )}

      {/* Afficher les informations de la race sélectionnée */}
      {selectedBreed && (
        <div className="breed-details" style={{ marginTop: '20px' }}>
          {/* Affichage de l'image de la race sélectionnée */}
          {selectedBreedImage && (
            <img
              src={selectedBreedImage}
              alt="Selected breed"
              style={{
                width: '200px',
                height: '200px',
                objectFit: 'cover',
                borderRadius: '5px',
                marginBottom: '20px',
              }}
            />
          )}

          <h2>{selectedBreed.name}</h2>
          <p><strong>Tempérament:</strong> {selectedBreed.temperament}</p>
          <p><strong>Espérance de vie:</strong> {selectedBreed.life_span}</p>
          <p><strong>Origine:</strong> {selectedBreed.origin}</p>
        </div>
      )}
    </div>
  );
};

export default DogSearch;

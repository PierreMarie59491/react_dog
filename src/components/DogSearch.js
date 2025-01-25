import React, { useState } from 'react';
import axios from 'axios';

const DogSearch = () => {
  const [searchTerm, setSearchTerm] = useState(''); // État pour stocker l'entrée de recherche
  const [images, setImages] = useState([]); // État pour stocker les images
  const [loading, setLoading] = useState(false); // État pour le spinner

  // Fonction pour effectuer la recherche
  const handleSearch = () => {
    if (!searchTerm) return; // Ne rien faire si le champ de recherche est vide

    setLoading(true); // Afficher le spinner pendant le chargement
    axios
      .get(`https://api.thedogapi.com/v1/breeds`)
      .then((response) => {
        // Trouver l'identifiant de la race correspondant au terme de recherche
        const breed = response.data.find((b) =>
          b.name.toLowerCase().includes(searchTerm.toLowerCase())
        );

        if (!breed) {
          setImages([]); // Vider les images si aucune race ne correspond
          alert('Aucune race correspondante trouvée.');
        } else {
          // Rechercher les images correspondant à cette race
          axios
            .get(
              `https://api.thedogapi.com/v1/images/search?limit=10&breed_id=${breed.id}`
            )
            .then((imageResponse) => {
              setImages(imageResponse.data); // Mettre à jour les images
            })
            .catch((error) => {
              console.error('Erreur lors de la récupération des images:', error);
            });
        }
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des races:', error);
      })
      .finally(() => setLoading(false)); // Désactiver le spinner une fois la requête terminée
  };

  return (
    <div>
      <h1>Recherche de chiens</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Entrez le nom d'une race..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // Mettre à jour l'état avec l'entrée utilisateur
          style={{
            padding: '10px',
            fontSize: '16px',
            marginRight: '10px',
            width: '300px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
          }}
        >
          Rechercher
        </button>
      </div>

      {loading ? (
        <p>Chargement des images...</p>
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
              <p style={{ marginTop: '10px' }}>
                {image.breeds && image.breeds[0] ? image.breeds[0].name : 'Race inconnue'}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DogSearch;

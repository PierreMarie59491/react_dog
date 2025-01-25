import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DogImages = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour récupérer les images de chiens
  const fetchImages = () => {
    setLoading(true); // Met le loading à true avant de récupérer les nouvelles images
    axios
      .get('https://api.thedogapi.com/v1/images/search?limit=10') // 10 images
      .then((response) => {
        setImages(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des images:', error);
        setLoading(false);
      });
  };

  useEffect(() => {
    // Récupérer les images immédiatement au premier rendu
    fetchImages();

    // Mettre à jour les images toutes les 10 secondes
    const intervalId = setInterval(fetchImages, 10000);

    // Cleanup pour arrêter l'intervalle lors du démontage du composant
    return () => clearInterval(intervalId);
  }, []); // Le tableau vide [] signifie que ce useEffect est exécuté uniquement lors du premier rendu

  if (loading) return <p>Chargement des images...</p>;

  return (
    <div>
      <h1>Images de Chiens</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {images.map((image, index) => (
          <div key={index} style={{ margin: '10px' }}>
            <img
              src={image.url}
              alt="dog"
              style={{ width: '200px', height: '200px', objectFit: 'cover' }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default DogImages;

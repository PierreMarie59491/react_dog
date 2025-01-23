import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './DogCarousel.css';  // Assurez-vous d'importer le CSS

const DogCarousel = () => {
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDogs = async () => {
      try {
        // 1. Récupérer les images de chiens
        const response = await axios.get('https://api.thedogapi.com/v1/images/search?limit=10');
        
        // 2. Ajouter les informations de la race pour chaque chien
        const dogsWithDetails = await Promise.all(response.data.map(async (image) => {
          const imageDetails = await axios.get(`https://api.thedogapi.com/v1/images/${image.id}`);
          
          // Extraire les informations de la race (si disponibles)
          const breed = imageDetails.data.breeds && imageDetails.data.breeds[0]
            ? imageDetails.data.breeds[0]
            : { name: 'Nom inconnu', temperament: 'Inconnu', life_span: 'Inconnu', origin: 'Inconnu' };
          
          return { 
            ...image, 
            breed
          };
        }));

        // Filtrer les images avec des races connues
        const filteredDogs = dogsWithDetails.filter(dog => dog.breed.name !== 'Nom inconnu');
        
        setDogs(filteredDogs);
      } catch (error) {
        console.error('Erreur lors de la récupération des images et des détails:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDogs();
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div>
      <h1>Carousel des Chiens</h1>
      {loading ? (
        <div className="spinner" />  // Affiche le spinner pendant le chargement
      ) : (
        <Slider {...settings}>
          {dogs.map((dog) => (
            <div key={dog.id} className="carousel-item">
              <div className="carousel-image">
                <img
                  src={dog.url}
                  alt="dog"
                  className="dog-image"
                />
              </div>
              <div className="carousel-info">
                <h3>{dog.breed.name}</h3> {/* Affiche le nom de la race */}
                <p><strong>Tempérament:</strong> {dog.breed.temperament}</p> {/* Affiche le tempérament */}
                <p><strong>Espérance de vie:</strong> {dog.breed.life_span}</p> {/* Affiche l'espérance de vie */}
                <p><strong>Origine:</strong> {dog.breed.origin}</p> {/* Affiche l'origine */}
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
};

export default DogCarousel;

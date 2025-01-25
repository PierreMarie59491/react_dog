import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DogList = () => {
  const [breeds, setBreeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get('https://api.thedogapi.com/v1/breeds') // Appel API
      .then((response) => {
        setBreeds(response.data); // Sauvegarde des données
        setLoading(false); // Fin du chargement
      })
      .catch((error) => {
        console.error('Erreur lors de la récupération des races:', error);
        setError('Impossible de charger les données.');
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Chargement des données...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>Liste des Races de Chiens</h1>
      <ul>
        {breeds.map((breed) => (
          <li key={breed.id}>
            {breed.name} - {breed.bred_for || 'Raison inconnue'}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DogList;

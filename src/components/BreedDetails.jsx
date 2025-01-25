import { motion } from 'framer-motion';


const BreedDetails = ({ breed, image }) => {
    return (
      <motion.div
        className="mt-6 p-4 border border-gray-300 rounded-lg"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {image && (
          <img
            src={image}
            alt={breed.name}
            className="w-full h-64 object-cover rounded-lg mb-4"
          />
        )}
        <h2 className="text-xl font-bold">{breed.name}</h2>
        <p><strong>Tempérament:</strong> {breed.temperament}</p>
        <p><strong>Espérance de vie:</strong> {breed.life_span}</p>
        <p><strong>Origine:</strong> {breed.origin}</p>
      </motion.div>
    );
  };
  
  export default BreedDetails;
  
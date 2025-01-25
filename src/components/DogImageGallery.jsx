import { motion } from 'framer-motion';


const DogImageGallery = ({ images, loading, errorMessage }) => {
    if (loading) return <p>Chargement des images...</p>;
    if (errorMessage) return <p className="image-container">{errorMessage}</p>;
  
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
        {images.map((image, index) => (
          <motion.div
            key={index}
            className="border border-gray-300 rounded-lg overflow-hidden"
            whileHover={{ scale: 1.05 }}
          >
            <img src={image.url} alt="Dog" className="w-full h-48 object-cover" />
            <p className="text-center p-2">{image.breed}</p>
          </motion.div>
        ))}
      </div>
    );
  };
  
  export default DogImageGallery;
  
import React from 'react';
import DogList from './components/DogList';
import DogImages from './components/DogImages';
import DogCarousel from './components/DogCarousel';

const App = () => {
  return (
    <div>
      {/* <DogList /> */}
      <DogCarousel />
      <DogImages />
    </div>
  );
};

export default App;

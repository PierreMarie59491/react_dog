import React from 'react';
import DogList from './components/DogList';
import DogImages from './components/DogImages';
import DogCarousel from './components/DogCarousel';
import DogSearch from './components/DogSearch';

const App = () => {
  return (
    <div>
      <DogSearch/>
      {/* <DogList /> */}
      <DogCarousel />
      {/* <DogImages /> */}
    </div>
  );
};

export default App;

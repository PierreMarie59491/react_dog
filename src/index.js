import React from 'react';
import ReactDOM from 'react-dom/client'; // Utilisation de `react-dom/client` pour React 18
import './index.css';
import App from './App';

// Crée une racine React
const root = ReactDOM.createRoot(document.getElementById('root'));

// Rends ton application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

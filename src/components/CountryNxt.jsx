// src/App.js
import React, { useState, useEffect } from 'react';
// No necesitas importar './App.css' si todos los estilos están en Tailwind

function CountryNavigator() {
  const [countries, setCountries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        let data = await response.json();

        data.sort((a, b) => {
          if (a.name.common < b.name.common) return -1;
          if (a.name.common > b.name.common) return 1;
          return 0;
        });

        setCountries(data);
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los países:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  const handleNextCountry = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % countries.length);
  };

  const handlePreviousCountry = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + countries.length) % countries.length);
  };

  if (loading) {
    return <p className="text-center text-xl p-10">Cargando países...</p>;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500 p-10">Error al cargar datos: {error}</p>;
  }

  if (countries.length === 0) {
    return <p className="text-center text-xl p-10">No se encontraron países.</p>;
  }

  const currentCountry = countries[currentIndex];
  const nextCountryIndex = (currentIndex + 1) % countries.length;
  const nextCountryName = countries.length > 0 ? countries[nextCountryIndex].name.common : "Siguiente";

  return (
    <div className="bg-white p-6 md:p-8 rounded-xl shadow-2xl max-w-lg w-full mx-auto my-8">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-6 text-center">
        Navegador de Países
      </h1>

      {currentCountry && (
        <div className="country-info mb-6 p-4 bg-slate-50 rounded-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-3">{currentCountry.name.common}</h2>
          <p className="text-gray-700 mb-1"><strong>Nombre Oficial:</strong> {currentCountry.name.official}</p>
          <p className="text-gray-700 mb-1"><strong>Capital:</strong> {currentCountry.capital ? currentCountry.capital.join(', ') : 'N/A'}</p>
          <p className="text-gray-700 mb-1"><strong>Región:</strong> {currentCountry.region}</p>
          <p className="text-gray-700 mb-3"><strong>Población:</strong> {currentCountry.population.toLocaleString()}</p>

          {currentCountry.flags?.png && (
            <img
              src={currentCountry.flags.png}
              alt={`Bandera de ${currentCountry.name.common}`}
              className="w-28 h-auto border border-gray-300 rounded my-3 mx-auto md:mx-0"
            />
          )}

          {currentCountry.maps?.googleMaps && (
            <a
              href={currentCountry.maps.googleMaps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-3 py-2 px-4 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-75"
            >
              Ver {currentCountry.name.common} en Google Maps
            </a>
          )}
        </div>
      )}

      <div className="navigation-buttons flex justify-between items-center space-x-3 mb-4">
        <button
          onClick={handlePreviousCountry}
          disabled={countries.length <= 1}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          País Anterior
        </button>
        <button
          onClick={handleNextCountry}
          disabled={countries.length <= 1}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
        >
          {countries.length > 1 ? `Siguiente (${nextCountryName})` : "Siguiente País"}
        </button>
      </div>
      <p className="country-counter text-center text-sm text-gray-600">
        Mostrando país {currentIndex + 1} de {countries.length}
      </p>
    </div>
  );
}

function CountryNxt() {
  return (
    <div className="App bg-gray-100 min-h-screen flex flex-col items-center justify-center p-4 font-sans">
      {/* El div App-header es reemplazado por clases en el div anterior */}
      <CountryNavigator />
    </div>
  );
}

export default CountryNxt;
// src/components/CountrySearchList.js
import { useState, useEffect } from 'react';
import LoadingSpinner from './LoadingSpinner';

function CountryCard({ country }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between">
      <div>
        {country.flags?.png && (
          <img
            src={country.flags.png}
            alt={`Bandera de ${country.name.common}`}
            className="w-full h-32 object-cover rounded-t-lg mb-3"
          />
        )}
        <h3 className="text-xl font-semibold text-gray-800 mb-1">{country.name.common}</h3>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}
        </p>
        <p className="text-sm text-gray-600 mb-1">
          <strong>Región:</strong> {country.region}
        </p>
        <p className="text-sm text-gray-600 mb-2">
          <strong>Población:</strong> {country.population.toLocaleString()}
        </p>
      </div>
      {country.maps?.googleMaps && (
        <a
          href={country.maps.googleMaps}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto inline-block w-full text-center py-2 px-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
        >
          Ver en Google Maps
        </a>
      )}
    </div>
  );
}

function CountrySearchList() {
  const [allCountries, setAllCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,region,population,flags,maps,cca3');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        let data = await response.json();

        data.sort((a, b) => a.name.common.localeCompare(b.name.common));

        setAllCountries(data);
        setFilteredCountries(data); // Inicialmente muestra todos los países
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los países:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCountries();
  }, []);

  useEffect(() => {
    const lowercasedFilter = searchTerm.toLowerCase();
    const filteredData = allCountries.filter(country =>
      country.name.common.toLowerCase().includes(lowercasedFilter)
    );
    setFilteredCountries(filteredData);
  }, [searchTerm, allCountries]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  if (loading) return <LoadingSpinner />;


  if (error) {
    return <p className="text-center text-xl text-red-500 p-10">Error al cargar datos: {error}</p>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-blue-600 mb-8 text-center">
        Buscador de Países
      </h1>

      <div className="mb-8 max-w-xl mx-auto">
        <input
          type="text"
          placeholder="Escribe el nombre de un país..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          aria-label="Buscar país"
        />
      </div>

      {filteredCountries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCountries.map(country => (
            <CountryCard key={country.cca3 || country.name.official} country={country} />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg">
          {searchTerm ? `No se encontraron países que coincidan con "${searchTerm}".` : "No hay países para mostrar."}
        </p>
      )}
    </div>
  );
}

export default CountrySearchList;
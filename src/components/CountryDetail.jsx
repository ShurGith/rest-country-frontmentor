import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LoadingSpinner from './LoadingSpinner';

const API_BASE_URL = 'https://restcountries.com/v3.1';

const CountryDetail = () => {
  const { countryName } = useParams();
  const navigate = useNavigate();
  const [country, setCountry] = useState(null);
  const [borderCountries, setBorderCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCountryData = useCallback(async (name) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/name/${name}?fullText=true`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data && data.length > 0) {
        setCountry(data[0]); // API returns an array

        // Fetch border countries if they exist
        if (data[0].borders && data[0].borders.length > 0) {
          const borderCodes = data[0].borders.join(',');
          const borderResponse = await fetch(`${API_BASE_URL}/alpha?codes=${borderCodes}&fields=name`);
          if (!borderResponse.ok) {
            console.warn(`Could not fetch border countries: ${borderResponse.status}`);
            setBorderCountries([]); // Or handle error differently
          } else {
            const borderData = await borderResponse.json();
            setBorderCountries(borderData.map(b => b.name.common));
          }
        } else {
          setBorderCountries([]);
        }
      } else {
        throw new Error('País no encontrado.');
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching country details:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (countryName) {
      fetchCountryData(decodeURIComponent(countryName));
    }
  }, [countryName, fetchCountryData]);

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;
  if (!country) return <p className="text-center text-gray-500 mt-10">No se encontró información del país.</p>;

  const getObjectValues = (obj) => obj ? Object.values(obj).join(', ') : 'N/A';
  const getCurrencies = (currenciesObj) => {
    if (!currenciesObj) return 'N/A';
    return Object.values(currenciesObj).map(c => `${c.name} (${c.symbol})`).join(', ');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="mb-8 bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow transition-colors duration-200"
      >
        ← Volver
      </button>

      <div className="bg-white p-6 md:p-8 rounded-lg shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={country.flags.svg || country.flags.png}
              alt={`Bandera de ${country.name.common}`}
              className="w-full h-auto object-contain rounded shadow-md mb-6 md:mb-0 max-h-80"
            />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-6">{country.name.common}</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-4 text-gray-700">
              <p><span className="font-semibold">Nombre Nativo:</span> {getObjectValues(country.name.nativeName)}</p>
              <p><span className="font-semibold">Población:</span> {country.population.toLocaleString()}</p>
              <p><span className="font-semibold">Región:</span> {country.region}</p>
              <p><span className="font-semibold">Subregión:</span> {country.subregion || 'N/A'}</p>
              <p><span className="font-semibold">Capital:</span> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
              <p><span className="font-semibold">Dominio TLD:</span> {country.tld ? country.tld.join(', ') : 'N/A'}</p>
              <p><span className="font-semibold">Monedas:</span> {getCurrencies(country.currencies)}</p>
              <p><span className="font-semibold">Idiomas:</span> {getObjectValues(country.languages)}</p>
            </div>

            {borderCountries.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-3">Países Fronterizos:</h3>
                <div className="flex flex-wrap gap-2">
                  {borderCountries.map(borderName => (
                    <Link
                      key={borderName}
                      to={`/country/${encodeURIComponent(borderName)}`}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded text-sm shadow transition-colors duration-200"
                    >
                      {borderName}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetail;
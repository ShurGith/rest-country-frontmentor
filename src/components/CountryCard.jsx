import React from 'react';
import { Link } from 'react-router-dom';

const CountryCard = ({ country }) => {
  return (
    <Link
      to={`/country/${encodeURIComponent(country.name.common)}`}
      className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 block"
    >
      <img
        src={country.flags.svg || country.flags.png}
        alt={`Bandera de ${country.name.common}`}
        className="w-full h-40 object-cover"
      />
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{country.name.common}</h3>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Población:</span> {country.population.toLocaleString()}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Región:</span> {country.region}
        </p>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Capital:</span> {country.capital ? country.capital.join(', ') : 'N/A'}
        </p>
      </div>
    </Link>
  );
};

export default CountryCard;
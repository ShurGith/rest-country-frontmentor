import React, { useState, useEffect } from 'react';

const FilterControls = ({ onRegionChange, onLanguageChange, allCountries }) => {
  const [regions, setRegions] = useState([]);
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    if (allCountries.length > 0) {
      const uniqueRegions = [...new Set(allCountries.map(country => country.region).filter(Boolean))].sort();
      const uniqueLanguages = [
        ...new Set(
          allCountries.flatMap(country =>
            country.languages ? Object.values(country.languages) : []
          ).filter(Boolean)
        )
      ].sort();
      setRegions(uniqueRegions);
      setLanguages(uniqueLanguages);
    }
  }, [allCountries]);

  return (
    <div className="my-6 p-4 bg-white rounded-lg shadow-md flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <label htmlFor="region-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Región:
        </label>
        <select
          id="region-filter"
          onChange={(e) => onRegionChange(e.target.value)}
          className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Todas las Regiones</option>
          {regions.map(region => (
            <option key={region} value={region}>{region}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 mb-1">
          Filtrar por Idioma:
        </label>
        <select
          id="language-filter"
          onChange={(e) => onLanguageChange(e.target.value)}
          className="mt-1 block w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        >
          <option value="">Todos los Idiomas</option>
          {languages.map(lang => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default FilterControls;
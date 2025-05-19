import React, { useState, useEffect, useCallback } from 'react';
import CountryCard from './CountryCard';
import LoadingSpinner from './LoadingSpinner';
import FilterControls from './FilterControls';

const API_BASE_URL = 'https://restcountries.com/v3.1';

const CountryList = () => {
  const [allCountries, setAllCountries] = useState([]); // Para popular filtros
  const [displayCountries, setDisplayCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');

  // Fetch all countries initially to populate filters
  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/all?fields=name,flags,population,region,capital,languages,cca3`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllCountries(data);
        setDisplayCountries(data); // Initially display all
      } catch (err) {
        setError(err.message);
        console.error("Error fetching initial data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  // Fetch countries based on filters
  const fetchFilteredCountries = useCallback(async (region, language) => {
    setLoading(true);
    setError(null);
    let url = `${API_BASE_URL}/all?fields=name,flags,population,region,capital,languages,cca3`; // Default to all

    if (region && !language) {
      url = `${API_BASE_URL}/region/${region}?fields=name,flags,population,region,capital,languages,cca3`;
    } else if (language && !region) {
      url = `${API_BASE_URL}/lang/${language}?fields=name,flags,population,region,capital,languages,cca3`;
    }
    // If both region and language are selected, we'll have to filter client-side
    // from the 'allCountries' or the one fetched by region/language, as the API
    // doesn't support combined server-side filtering directly.
    // For simplicity, this example prioritizes region, then language, or fetches all.
    // A more robust solution would fetch all and then filter client-side if both are selected.

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404) { // Handle 404 for non-existent region/language
          setDisplayCountries([]);
          setError(null); // Not a fatal error, just no results
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      let data = await response.json();

      // Client-side filtering if both are selected
      if (region && language) {
        // Start with countries from the region
        const regionResponse = await fetch(`${API_BASE_URL}/region/${region}?fields=name,flags,population,region,capital,languages,cca3`);
        if (!regionResponse.ok) throw new Error(`HTTP error fetching region: ${regionResponse.status}`);
        let regionData = await regionResponse.json();

        data = regionData.filter(country =>
          country.languages && Object.values(country.languages).includes(language)
        );

      } else if (language && !region) {
        // API already filtered by language
      } else if (region && !language) {
        // API already filtered by region
      }


      setDisplayCountries(data);
    } catch (err) {
      setError(err.message);
      setDisplayCountries([]); // Clear display on error
      console.error("Error fetching filtered data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // If no filters, show all countries (already fetched)
    if (!selectedRegion && !selectedLanguage) {
      setDisplayCountries(allCountries); // Use the initially fetched full list
      setLoading(false); // Ensure loading is off
      setError(null);
      return;
    }
    // Otherwise, fetch based on current filters
    fetchFilteredCountries(selectedRegion, selectedLanguage);
  }, [selectedRegion, selectedLanguage, fetchFilteredCountries, allCountries]);


  const handleRegionChange = (region) => {
    setSelectedRegion(region);
    // If region is cleared, and language is set, language filter should still apply.
    // If region is cleared, and language is also cleared, fetch all.
  };

  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    // Similar logic as region change.
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <p className="text-red-500 text-center mt-10">Error: {error}</p>;

  return (
    <div className="container mx-auto px-4 py-8 lg:min-w-full">
      <FilterControls
        onRegionChange={handleRegionChange}
        onLanguageChange={handleLanguageChange}
        allCountries={allCountries} // Pass all countries to populate filters
      />
      {displayCountries.length === 0 && !loading && (
        <p className="text-center text-gray-500 mt-10">No se encontraron países con los filtros seleccionados.</p>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCountries.map(country => (
          <CountryCard key={country.cca3 || country.name.common} country={country} />
        ))}
      </div>
    </div>
  );
};

export default CountryList;
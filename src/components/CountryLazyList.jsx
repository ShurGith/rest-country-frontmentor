// src/components/CountrySearchList.js
import React, { useState, useEffect, useRef, useCallback } from 'react';
import LoadingSpinner from './LoadingSpinner';

const CHUNK_SIZE = 20; // Cuántos países cargar a la vez

function CountryCard({ country }) {
  // ... (el mismo componente CountryCard de la respuesta anterior)
  return (
    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-200 flex flex-col justify-between h-full">
      <div>
        {country.flags?.png ? (
          <img
            src={country.flags.png}
            alt={`Bandera de ${country.name.common}`}
            className="w-full h-32 object-cover rounded-t-lg mb-3"
          />
        ) : (
          <div className="w-full h-32 bg-gray-200 rounded-t-lg mb-3 flex items-center justify-center text-gray-400">
            Sin Bandera
          </div>
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
          className="mt-auto block w-full text-center py-2 px-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors duration-200 text-sm"
        >
          Ver en Google Maps
        </a>
      )}
    </div>
  );
}


function CountryLazyList() {
  const [allCountries, setAllCountries] = useState([]); // Todos los países de la API
  const [displayedCountries, setDisplayedCountries] = useState([]); // Países actualmente mostrados
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Carga inicial de la API
  const [error, setError] = useState(null);
  const [visibleCount, setVisibleCount] = useState(CHUNK_SIZE); // Cuántos ítems son visibles
  const [isLoadingMore, setIsLoadingMore] = useState(false); // Para el feedback de "cargando más"

  const observer = useRef(); // Para el IntersectionObserver

  // Función para obtener la lista base (todos o filtrados)
  const getBaseCountryList = useCallback(() => {
    if (searchTerm) {
      const lowercasedFilter = searchTerm.toLowerCase();
      return allCountries.filter(country =>
        country.name.common.toLowerCase().includes(lowercasedFilter)
      );
    }
    return allCountries;
  }, [allCountries, searchTerm]);


  // Carga inicial de datos
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
        // No establecemos displayedCountries aquí directamente, lo hará el efecto de searchTerm/allCountries
      } catch (err) {
        setError(err.message);
        console.error("Error al obtener los países:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCountries();
  }, []);


  // Efecto para actualizar displayedCountries cuando cambia el filtro o la lista base, o visibleCount
  useEffect(() => {
    if (allCountries.length === 0) return; // No hacer nada si no hay datos base

    const baseList = getBaseCountryList();
    setDisplayedCountries(baseList.slice(0, visibleCount));

  }, [searchTerm, allCountries, visibleCount, getBaseCountryList]);


  // Efecto para reiniciar visibleCount cuando el término de búsqueda cambia
  useEffect(() => {
    setVisibleCount(CHUNK_SIZE); // Resetear a la carga inicial cuando se busca
  }, [searchTerm]);


  // Callback para IntersectionObserver
  const lastCountryElementRef = useCallback(node => {
    if (isLoadingMore || loading) return; // No observar si ya se está cargando o en carga inicial
    if (observer.current) observer.current.disconnect(); // Desconectar observador anterior

    observer.current = new IntersectionObserver(entries => {
      const baseList = getBaseCountryList();
      if (entries[0].isIntersecting && visibleCount < baseList.length) {
        setIsLoadingMore(true);
        // Simular un pequeño delay para que el "cargando más" sea visible
        setTimeout(() => {
          setVisibleCount(prevCount => Math.min(prevCount + CHUNK_SIZE, baseList.length));
          setIsLoadingMore(false);
        }, 1300); // Pequeño delay opcional
      }
    });

    if (node) observer.current.observe(node); // Observar el nuevo nodo
  }, [isLoadingMore, loading, visibleCount, getBaseCountryList]);


  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  if (loading && allCountries.length === 0) { // Solo mostrar carga inicial si no hay países aún
    return <LoadingSpinner />;
  }

  if (error) {
    return <p className="text-center text-xl text-red-500 p-10">Error al cargar datos: {error}</p>;
  }

  const currentFullFilteredList = getBaseCountryList(); // Para saber el total actual filtrado

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

      {displayedCountries.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedCountries.map((country, index) => {
            // Si es el último elemento de la lista actual de `displayedCountries`, le asignamos la ref
            if (displayedCountries.length === index + 1) {
              return (
                <div ref={lastCountryElementRef} key={country.cca3 || country.name.official}>
                  <CountryCard country={country} />
                </div>
              );
            } else {
              return <CountryCard key={country.cca3 || country.name.official} country={country} />;
            }
          })}
        </div>
      ) : (
        <p className="text-center text-gray-600 text-lg mt-10">
          {searchTerm && !loading ? `No se encontraron países que coincidan con "${searchTerm}".` :
            !loading && allCountries.length > 0 ? "No hay más países para mostrar con este filtro." :
              !loading && allCountries.length === 0 ? "No hay países para mostrar." : ""}
        </p>
      )}

      {isLoadingMore && (
        <LoadingSpinner />
      )}

      {!isLoadingMore && displayedCountries.length > 0 && visibleCount >= currentFullFilteredList.length && currentFullFilteredList.length > 0 && (
        <p className="text-center text-md text-gray-500 py-6">Has llegado al final de la lista.</p>
      )}
    </div>
  );
}

export default CountryLazyList;
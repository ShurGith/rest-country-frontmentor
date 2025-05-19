import { useEffect, useState } from "react";

function CountryList() {
  // Estado para almacenar la lista de países
  const [countries, setCountries] = useState([]);
  // Estado para manejar la carga
  const [isLoading, setIsLoading] = useState(true);
  // Estado para manejar errores
  const [error, setError] = useState(null);
  // Estado para el término de búsqueda
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Función asíncrona para obtener los datos
    const fetchCountries = async () => {
      setIsLoading(true); // Indicar que estamos cargando
      setError(null);     // Limpiar errores previos

      try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) {
          throw new Error(`Error HTTP: ${response.status}`);
        }
        const data = await response.json();
        setCountries(data); // Guardar los datos en el estado
      } catch (err) {
        setError(err.message); // Guardar el mensaje de error
        setCountries([]);      // Limpiar países en caso de error
      } finally {
        setIsLoading(false); // Indicar que la carga ha finalizado (éxito o error)
      }
    };

    fetchCountries(); // Llamar a la función al montar el componente

    // La función de limpieza de useEffect (return) se ejecutaría si el componente se desmonta.
    // En este caso, no es estrictamente necesario para un fetch simple, pero es buena práctica
    // si tuvieras suscripciones o temporizadores.
  }, []); // El array vacío [] significa que este efecto se ejecuta solo una vez (al montar)

  // Filtrar países basados en el término de búsqueda
  const filteredCountries = countries.filter(country =>
    country.name.common.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (country.capital && country.capital[0] && country.capital[0].toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Renderizado condicional basado en el estado
  if (isLoading) {
    return <p>Cargando países...</p>;
  }

  if (error) {
    return <p>Error al cargar datos: {error}</p>;
  }

  return (
    <div>
      <h1>Lista de Países</h1>
      <input
        type="text"
        placeholder="Buscar país o capital..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '300px' }}
      />
      {filteredCountries.length > 0 ? (
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          {filteredCountries.map((country) => (
            <li key={country.cca3} style={{ border: '1px solid #ddd', margin: '10px 0', padding: '10px' }}>
              <h2>{country.name.common} ({country.translations.spa?.common || country.name.official})</h2>
              <img src={country.flags.svg} alt={`Bandera de ${country.name.common}`} width="100" />
              <p><strong>Capital:</strong> {country.capital ? country.capital.join(', ') : 'N/A'}</p>
              <p><strong>Población:</strong> {country.population.toLocaleString()}</p>
              <p><strong>Región:</strong> {country.region}</p>
              <p><strong>Subregión:</strong> {country.subregion}</p>
              {country.currencies && (
                <p>
                  <strong>Monedas:</strong>
                  {Object.values(country.currencies).map(c => `${c.name} (${c.symbol})`).join(', ')}
                </p>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No se encontraron países con ese criterio.</p>
      )}
    </div>
  );
}

export default CountryList;
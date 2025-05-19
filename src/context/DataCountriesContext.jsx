import { createContext, useContext, useEffect, useState } from "react";
const DataCountriesContext = createContext();

export const DataCountriesProvider = ({ children }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetch('/data/data.json')
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch((err) => console.error('Error al cargar el JSON:', err));
  }, []);



  return (
    <DataCountriesContext.ProviderContext.Provider value={{
      data
    }}>
      {children}
    </DataCountrieContext.Provider>
  );
};

export const useDataCountrie = () => {
  const context = useContext(DataCountriesContext);
  if (!context) {
    throw new Error("useDataCountrie debe usarse dentro de un DataCountriesProvide ");
  }
  return context;
};
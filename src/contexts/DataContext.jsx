// DataContext.js
import React, { createContext, useContext, useState } from 'react';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [data, setData] = useState([]);
    const [google, setGoogle] = useState(null); // Define google object


  const updateData = (newData) => {
    setData(newData);
  };

  return (
    <DataContext.Provider value={{ data, updateData,google }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
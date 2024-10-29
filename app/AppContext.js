import React, { createContext, useState, useContext } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [preferences, setPreferences] = useState('');
  const [photos, setPhotos] = useState([]);
  const [address, setAddress] = useState('');

  return (
    <AppContext.Provider value={{ preferences, setPreferences, photos, setPhotos, address, setAddress }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { ScenarioResponse, ScenarioType } from './types';

interface AppContextType {
  preferences: ScenarioType | string;
  setPreferences: (pref: ScenarioType | string) => void;
  photos: string[];
  setPhotos: React.Dispatch<React.SetStateAction<string[]>>;
  address: string;
  setAddress: (addr: string) => void;
  scenarioResult: ScenarioResponse | null;
  setScenarioResult: (res: ScenarioResponse | null) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [preferences, setPreferences] = useState<ScenarioType | string>('foodGarden');
  const [photos, setPhotos] = useState<string[]>([]);
  const [address, setAddress] = useState<string>('');
  const [scenarioResult, setScenarioResult] = useState<ScenarioResponse | null>(null);

  const resetApp = () => {
    setPreferences('foodGarden');
    setPhotos([]);
    setAddress('');
    setScenarioResult(null);
  };

  return (
    <AppContext.Provider
      value={{
        preferences,
        setPreferences,
        photos,
        setPhotos,
        address,
        setAddress,
        scenarioResult,
        setScenarioResult,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

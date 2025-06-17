import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { QRCodeData } from '../types/qrTypes';

interface HistoryContextType {
  history: QRCodeData[];
  addToHistory: (qrData: QRCodeData) => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

const HistoryContext = createContext<HistoryContextType | undefined>(undefined);

export const useHistory = (): HistoryContextType => {
  const context = useContext(HistoryContext);
  if (!context) {
    throw new Error('useHistory must be used within a HistoryProvider');
  }
  return context;
};

interface HistoryProviderProps {
  children: ReactNode;
}

export const HistoryProvider: React.FC<HistoryProviderProps> = ({ children }) => {
  const [history, setHistory] = useState<QRCodeData[]>(() => {
    const savedHistory = localStorage.getItem('qrHistory');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  useEffect(() => {
    localStorage.setItem('qrHistory', JSON.stringify(history));
  }, [history]);

  const addToHistory = (qrData: QRCodeData) => {
    setHistory((prevHistory) => [qrData, ...prevHistory.slice(0, 29)]);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const removeFromHistory = (id: string) => {
    setHistory((prevHistory) => prevHistory.filter((item) => item.id !== id));
  };

  return (
    <HistoryContext.Provider value={{ history, addToHistory, clearHistory, removeFromHistory }}>
      {children}
    </HistoryContext.Provider>
  );
};
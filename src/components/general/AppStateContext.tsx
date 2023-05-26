import React, { createContext, useContext, useState } from 'react';

interface AppStateContextProps {
  disconnected: boolean;
  setDisconnected: (value: boolean) => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(undefined);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error('useAppState must be used within an AppStateProvider');
  }
  return context;
};

export const AppStateProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [disconnected, setDisconnected] = useState(false);

  const contextValue: AppStateContextProps = {
    disconnected,
    setDisconnected,
  };

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

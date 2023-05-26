import React, { createContext, useContext, useState } from 'react';

interface AppStateContextProps {
  createBoardModalOpen: boolean;
  setCreateBoardModalOpen: (open: boolean) => void;
  navbarModalOpen: boolean;
  setNavbarModalOpen: (open: boolean) => void;
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
  const [createBoardModalOpen, setCreateBoardModalOpen] = useState<boolean>(false);
  const [navbarModalOpen, setNavbarModalOpen] = useState<boolean>(false);

  const contextValue: AppStateContextProps = {
    createBoardModalOpen,
    setCreateBoardModalOpen: (value: boolean) => {
      setNavbarModalOpen(false);
      setCreateBoardModalOpen(value);
    },
    navbarModalOpen,
    setNavbarModalOpen,
  };

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

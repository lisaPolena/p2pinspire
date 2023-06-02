import React, { createContext, useContext, useState } from 'react';

interface AppStateContextProps {
  createBoardModalOpen: boolean;
  setCreateBoardModalOpen: (open: boolean) => void;
  navbarModalOpen: boolean;
  setNavbarModalOpen: (open: boolean) => void;
  loadCreateBoardTransaction: boolean;
  setLoadCreateBoardTransaction: (loading: boolean) => void;
  editModalOpen: boolean;
  setEditModalOpen: (open: boolean) => void;
  editBoardModalOpen: boolean;
  setEditBoardModalOpen: (open: boolean) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  loadDeleteBoardTransaction: number;
  setLoadDeleteBoardTransaction: (id: number) => void;
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
  const [loadCreateBoardTransaction, setLoadCreateBoardTransaction] = useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [loadDeleteBoardTransaction, setLoadDeleteBoardTransaction] = useState<number>(0);

  const contextValue: AppStateContextProps = {
    createBoardModalOpen,
    setCreateBoardModalOpen: (value: boolean) => {
      setNavbarModalOpen(false);
      setCreateBoardModalOpen(value);
    },
    navbarModalOpen,
    setNavbarModalOpen,
    loadCreateBoardTransaction,
    setLoadCreateBoardTransaction,
    editModalOpen,
    setEditModalOpen,
    editBoardModalOpen,
    setEditBoardModalOpen: (value: boolean) => {
      setEditModalOpen(false);
      setEditBoardModalOpen(value);
    },
    deleteModalOpen,
    setDeleteModalOpen: (value: boolean) => {
      setEditModalOpen(false);
      setEditBoardModalOpen(true)
      setDeleteModalOpen(value);
    },
    loadDeleteBoardTransaction,
    setLoadDeleteBoardTransaction,
  };

  return <AppStateContext.Provider value={contextValue}>{children}</AppStateContext.Provider>;
};

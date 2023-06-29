import { Board, User } from "@/common/types/structs";
import React, { createContext, useContext, useState } from "react";

interface AppStateContextProps {
  allBoards: Board[];
  setAllBoards: (boards: Board[]) => void;
  user: User | null;
  setUser: (user: User | null) => void;
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
  createPinModalOpen: boolean;
  setCreatePinModalOpen: (open: boolean) => void;
  createdPin: { boardName: string; imageHash: string } | null;
  setCreatedPin: (pin: { boardName: string; imageHash: string } | null) => void;
  deleteModalOpen: boolean;
  setDeleteModalOpen: (open: boolean) => void;
  loadDeleteBoardTransaction: number;
  setLoadDeleteBoardTransaction: (id: number) => void;
  editPinModalOpen: boolean;
  setEditPinModalOpen: (open: boolean) => void;
  downloadPin: boolean;
  setDownloadPin: (open: boolean) => void;
  deletePinModalOpen: boolean;
  setDeletePinModalOpen: (open: boolean) => void;
  savePinModalOpen: boolean;
  setSavePinModalOpen: (open: boolean) => void;
  loadSavePinTransaction: number;
  setLoadSavePinTransaction: (id: number) => void;
  filterBoardModalOpen: boolean;
  setFilterBoardModalOpen: (open: boolean) => void;
  boardView: string;
  setBoardView: (view: string) => void;
  addModalOpen: boolean;
  setAddModalOpen: (open: boolean) => void;
  editProfileModalOpen: boolean;
  setEditProfileModalOpen: (open: boolean) => void;
  deleteProfile: string;
  setDeleteProfile: (open: string) => void;
}

const AppStateContext = createContext<AppStateContextProps | undefined>(
  undefined
);

export const useAppState = () => {
  const context = useContext(AppStateContext);
  if (!context) {
    throw new Error("useAppState must be used within an AppStateProvider");
  }
  return context;
};

export const AppStateProvider: React.FC<React.PropsWithChildren<{}>> = ({
  children,
}) => {
  const [allBoards, setAllBoards] = useState<Board[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [navbarModalOpen, setNavbarModalOpen] = useState<boolean>(false);
  const [createBoardModalOpen, setCreateBoardModalOpen] =
    useState<boolean>(false);
  const [createPinModalOpen, setCreatePinModalOpen] = useState<boolean>(false);
  const [createdPin, setCreatedPin] = useState<{
    boardName: string;
    imageHash: string;
  } | null>(null);
  const [loadCreateBoardTransaction, setLoadCreateBoardTransaction] =
    useState<boolean>(false);
  const [editModalOpen, setEditModalOpen] = useState<boolean>(false);
  const [editBoardModalOpen, setEditBoardModalOpen] = useState<boolean>(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [loadDeleteBoardTransaction, setLoadDeleteBoardTransaction] =
    useState<number>(0);
  const [editPinModalOpen, setEditPinModalOpen] = useState<boolean>(false);
  const [downloadPin, setDownloadPin] = useState<boolean>(false);
  const [deletePinModalOpen, setDeletePinModalOpen] = useState<boolean>(false);
  const [savePinModalOpen, setSavePinModalOpen] = useState<boolean>(false);
  const [filterBoardModalOpen, setFilterBoardModalOpen] =
    useState<boolean>(false);
  const [boardView, setBoardView] = useState<string>("default");
  const [loadSavePinTransaction, setLoadSavePinTransaction] =
    useState<number>(0);
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);
  const [editProfileModalOpen, setEditProfileModalOpen] =
    useState<boolean>(false);
  const [deleteProfile, setDeleteProfile] = useState<string>("");

  const contextValue: AppStateContextProps = {
    allBoards,
    setAllBoards,
    user,
    setUser,
    navbarModalOpen,
    setNavbarModalOpen,
    createBoardModalOpen,
    setCreateBoardModalOpen: (value: boolean) => {
      setNavbarModalOpen(false);
      setCreateBoardModalOpen(value);
    },
    createPinModalOpen,
    setCreatePinModalOpen: (value: boolean) => {
      setNavbarModalOpen(false);
      setCreatePinModalOpen(value);
    },
    createdPin,
    setCreatedPin,
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
      setEditBoardModalOpen(true);
      setDeleteModalOpen(value);
    },
    loadDeleteBoardTransaction,
    setLoadDeleteBoardTransaction,
    editPinModalOpen,
    setEditPinModalOpen: (value: boolean) => {
      setEditModalOpen(false);
      setEditPinModalOpen(value);
    },
    downloadPin,
    setDownloadPin,
    deletePinModalOpen,
    setDeletePinModalOpen: (value: boolean) => {
      setEditModalOpen(false);
      setEditPinModalOpen(true);
      setDeletePinModalOpen(value);
    },
    savePinModalOpen,
    setSavePinModalOpen,
    filterBoardModalOpen,
    setFilterBoardModalOpen,
    boardView,
    setBoardView,
    loadSavePinTransaction,
    setLoadSavePinTransaction,
    addModalOpen,
    setAddModalOpen,
    editProfileModalOpen,
    setEditProfileModalOpen,
    deleteProfile,
    setDeleteProfile,
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

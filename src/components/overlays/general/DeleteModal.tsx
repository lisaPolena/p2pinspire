import React from "react";
import { useAppState } from "../../general/AppStateContext";
import OutsideAlerter from "../../general/OutsideClickAlerter";
import { Button, useToast } from "@chakra-ui/react";
import { useRouter } from "next/router";
import boardManager from "../../../contracts/build/BoardManager.json";
import pinManager from "../../../contracts/build/PinManager.json";
import { useContractWrite } from "wagmi";
import { Toast } from "../../general/Toasts";
import { Board, Pin } from "@/common/types/structs";

interface DeleteModalProps {
  isOpen: boolean;
  isBoard: boolean;
  closeModal: () => void;
  board?: Board | null;
  pin?: Pin | null;
  isOwner?: boolean;
  savedPinBoardId?: string | number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  isBoard,
  closeModal,
  board,
  pin,
  isOwner,
  savedPinBoardId,
}) => {
  const {
    setDeleteModalOpen,
    setEditBoardModalOpen,
    setLoadDeleteBoardTransaction,
    setDeletePinModalOpen,
    setEditPinModalOpen,
  } = useAppState();
  const router = useRouter();
  const toast = useToast();

  const {
    data: deleteCreatedPinData,
    status: deleteCreatedPinStatus,
    writeAsync: deleteCreatedPin,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "deletePin",
  });

  const {
    data: deleteSavedPinData,
    status: deleteSavedPinStatus,
    writeAsync: deleteSavedPin,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "deleteSavedPin",
  });

  const {
    data: deleteBoardData,
    status: deleteBoardStatus,
    writeAsync: deleteBoard,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "deleteBoard",
  });

  const handleDeleteBoard = async () => {
    if (board) {
      setDeleteModalOpen(false);
      setEditBoardModalOpen(false);
      await deleteBoard({ args: [board.id] });
      setLoadDeleteBoardTransaction(Number(board.id));
      handleToast("Board deleting...");
      router.push("/profile");
    } else {
      handleToast("Board not found.");
    }
  };

  const deletePin = async () => {
    if (pin && isOwner) {
      await deleteCreatedPin({ args: [pin.id] })
        .then(() => {
          handleToast("Pin deleting...");
          setDeletePinModalOpen(false);
          setEditPinModalOpen(false);
          router.back();
        })
        .catch(() => {
          handleToast("Transaction rejected");
          setDeletePinModalOpen(false);
          setEditPinModalOpen(false);
        });
    } else if (pin && !isOwner) {
      await deleteSavedPin({ args: [pin.id, savedPinBoardId] })
        .then(() => {
          handleToast("Pin deleting...");
          setDeletePinModalOpen(false);
          setEditPinModalOpen(false);
          router.back();
        })
        .catch(() => {
          handleToast("Transaction rejected");
          setDeletePinModalOpen(false);
          setEditPinModalOpen(false);
        });
    } else {
      handleToast("Pin not found.");
    }
  };

  function handleToast(message: string, imageHash?: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <div className="z-50">
      {isOpen && (
        <OutsideAlerter action={closeModal}>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-900 rounded-t-[40px] z-[30] h-[20%]">
            <div className="text-center">
              <h2 className="mb-2 text-2xl font-bold text-white">
                Are you sure?
              </h2>
              {savedPinBoardId && !isOwner && (
                <p className="opacity-60">
                  If you delete this pin, it will be gone from this board.
                </p>
              )}
              {savedPinBoardId && isOwner && (
                <p className="opacity-60">
                  If you delete this pin, it will be gone forever. Everyone who
                  saved it, cannot view it anymore.
                </p>
              )}
              {isBoard && (
                <p className="opacity-60">
                  If you delete this board, it will be gone forever with all of
                  its pins.
                </p>
              )}
            </div>
            <div className="flex pt-2 justify-evenly">
              <Button
                colorScheme="secondary"
                borderRadius={"50px"}
                variant="solid"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button
                colorScheme="primary"
                borderRadius={"50px"}
                variant="solid"
                onClick={
                  isBoard ? () => handleDeleteBoard() : () => deletePin()
                }
              >
                {isBoard ? "Delete forever" : "Delete"}
              </Button>
            </div>
          </div>
        </OutsideAlerter>
      )}
    </div>
  );
};

export default DeleteModal;

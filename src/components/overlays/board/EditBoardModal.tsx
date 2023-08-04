import React, { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import { useAppState } from "../../general/AppStateContext";
import { Input, Slide, Switch, Textarea, useToast } from "@chakra-ui/react";
import DeleteModal from "../general/DeleteModal";
import boardManager from "../../../contracts/build/BoardManager.json";
import { useContractWrite } from "wagmi";
import { IoAdd, IoChevronBack } from "react-icons/io5";
import { RiEditCircleFill } from "react-icons/ri";
import { Board, Pin } from "@/common/types/structs";
import { Toast } from "../../general/Toasts";
import Image from "next/image";

interface EditBoardModalProps {
  board: Board | null;
  pins?: Pin[] | null;
}

const EditBoardModal: React.FC<EditBoardModalProps> = (
  props: EditBoardModalProps
) => {
  const { board, pins } = props;
  const {
    editBoardModalOpen,
    setEditBoardModalOpen,
    deleteModalOpen,
    setDeleteModalOpen,
  } = useAppState();
  const [boardName, setBoardName] = useState<string>("");
  const [boardDescription, setBoardDescription] = useState<string>("");
  const [boardCoverImage, setBoardCoverImage] = useState<string>("");
  const [pinSlideOpen, setPinSlideOpen] = useState<boolean>(false);
  const toast = useToast();

  const {
    data: editBoardData,
    status: editBoardStatus,
    writeAsync: editBoard,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "editBoard",
  });

  useEffect(() => {
    if (board) {
      setBoardName(board.name);
      setBoardDescription(board.description ?? "");
      setBoardCoverImage(board.boardCoverHash ?? "");
    }
  }, [board, editBoardModalOpen]);

  const handleEditBoard = async () => {
    if (!boardName || (boardDescription && boardDescription.length > 50)) {
      if (!boardName) {
        handleToast("Board Name is empty!", "");
        return;
      }
      if (boardDescription.length > 50) {
        handleToast("Description is longer than 50 Characters!", "");
      }
      return;
    }
    await editBoard({
      args: [board?.id, boardName, boardDescription, boardCoverImage],
    })
      .then(() => {
        setEditBoardModalOpen(false);
        handleToast(boardName + " editing...", "");
      })
      .catch((err) => {
        setEditBoardModalOpen(false);
        handleToast("Transaction rejected");
      });
  };

  function handleToast(message: string, imageHash?: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <>
      {deleteModalOpen && (
        <div className="absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70"></div>
      )}
      <Modal
        isOpen={editBoardModalOpen}
        closeModal={() => setEditBoardModalOpen(false)}
        title="Edit Board"
        height="h-[99%]"
      >
        <div className="absolute top-3 right-3">
          <button
            className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
            disabled={boardName?.length === 0}
            onClick={() => handleEditBoard()}
          >
            Done
          </button>
        </div>
        <div className="flex flex-col gap-4">
          <div>
            <p className="mb-2">Board cover</p>

            {!boardCoverImage ? (
              <div
                className="flex items-center justify-center w-40 h-40 mt-2 border-2 border-white border-dashed rounded-3xl"
                onClick={() => setPinSlideOpen(true)}
              >
                <IoAdd size={30} />
              </div>
            ) : (
              <div onClick={() => setPinSlideOpen(true)}>
                <Image
                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${boardCoverImage}`}
                  className="object-cover w-40 h-40 rounded-2xl"
                  alt="Board cover"
                  width={100}
                  height={100}
                />
                <RiEditCircleFill
                  size={23}
                  className="absolute left-36 top-60"
                  color="white"
                />
              </div>
            )}
          </div>

          <div>
            <p>Board name</p>
            <Input
              variant="unstyled"
              placeholder="Add"
              defaultValue={boardName}
              onChange={(e) => setBoardName(e.target.value)}
            />
          </div>

          <div>
            <p>Description</p>
            <Textarea
              variant="unstyled"
              placeholder="Add what you board is about"
              size={"lg"}
              defaultValue={boardDescription}
              onChange={(e) => setBoardDescription(e.target.value)}
            />
          </div>

          <div>
            <p>Collaborators</p>
            <Input variant="unstyled" placeholder="Collaborators" />
          </div>

          <div>
            <p>Settings</p>
            <div className="flex flex-col justify-between item-center">
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Make this board secret</p>
                  <p className="text-gray-400 text-s">
                    Only you and collaborators will see this board
                  </p>
                </div>
                <div className="mt-1">
                  <Switch size="md" />
                </div>
              </div>
              <div className="flex flex-row">
                <div>
                  <p className="font-bold">Personalisation</p>
                  <p className="text-gray-400 text-s">
                    Show Pins inspired by this board in your home feed
                  </p>
                </div>
                <div className="mt-1">
                  <Switch size="md" />
                </div>
              </div>
            </div>
          </div>

          <div>
            <p>Actions</p>
            <div
              className="flex justify-between item-center"
              onClick={() => setDeleteModalOpen(true)}
            >
              <div>
                <p className="font-bold">Delete Board</p>
                <p className="text-gray-400 text-s">
                  Delete this board and all of its Pins forever. You can not
                  undo this.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Slide direction="right" in={pinSlideOpen} style={{ zIndex: 20 }}>
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] h-full">
            <div className="flex items-center gap-24">
              <button
                className="text-white"
                onClick={() => setPinSlideOpen(false)}
              >
                <IoChevronBack size={30} />
              </button>
              <h2 className="text-base font-bold text-white">
                Set Board Cover
              </h2>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 px-4 relative top-[50px] mt-2">
            {pins?.map((pin: Pin) => (
              <div
                key={pin.id}
                onClick={() => {
                  setBoardCoverImage(pin.imageHash);
                  setPinSlideOpen(false);
                }}
              >
                <Image
                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                  alt={pin.title}
                  className="object-cover w-full rounded-2xl max-h-52"
                  width={100}
                  height={100}
                />
              </div>
            ))}
          </div>
        </Slide>
      </Modal>
      <DeleteModal
        isOpen={deleteModalOpen}
        closeModal={() => setDeleteModalOpen(false)}
        isBoard={true}
        board={board}
      />
    </>
  );
};

export default EditBoardModal;

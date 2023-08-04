import React, { useEffect, useState } from "react";
import Modal from "../../general/Modal";
import { useAppState } from "../../general/AppStateContext";
import { useRouter } from "next/router";
import { List, ListItem, useToast } from "@chakra-ui/react";
import boardManager from "../../../contracts/build/BoardManager.json";
import pinManager from "../../../contracts/build/PinManager.json";
import { useAccount, useContractRead, useContractWrite } from "wagmi";
import { Board, Pin } from "@/common/types/structs";
import { Toast } from "@/components/general/Toasts";
import Image from "next/image";

interface SavePinModalProps {
  pinId: number | null;
}

const SavePinModal: React.FC<SavePinModalProps> = (
  props: SavePinModalProps
) => {
  const { pinId } = props;
  const { address, isConnected } = useAccount();
  const {
    allBoards,
    savePinModalOpen,
    setSavePinModalOpen,
    setLoadSavePinTransaction,
  } = useAppState();
  const router = useRouter();
  const [pin, setPin] = useState<Pin | null>(null);
  const id = pinId ?? router.query.id;
  const toast = useToast();

  const {
    data: savePinToBoardData,
    status: savePinToBoardStatus,
    writeAsync: savePinToBoard,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "savePinToBoard",
  });

  const { data: allPinsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "getAllPins",
    onSuccess(data) {
      const res = data as Pin[];
      const pin = res.find((pin: Pin) => Number(pin.id) === Number(id));
      setPin(pin ?? null);
    },
  });

  const handleSavePinToBoard = async (boardId: number) => {
    setSavePinModalOpen(false);
    if (pin) {
      await savePinToBoard({
        args: [
          boardId,
          pin.id,
          pin.title,
          pin.description,
          pin.imageHash,
          pin.owner,
        ],
      })
        .then(() => {
          setLoadSavePinTransaction(Number(pin.id) ?? 0);
        })
        .catch((err) => {
          handleToast("Transaction rejected");
        });
    } else {
      handleToast("Pin not found!");
    }
    router.push("/home");
  };

  function handleToast(message: string, imageHash?: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <Modal
      isOpen={savePinModalOpen}
      closeModal={() => setSavePinModalOpen(false)}
      title="Save to board"
      height="h-full"
    >
      <List>
        {allBoards.map((board: Board) => (
          <ListItem
            key={Number(board.id)}
            onClick={() => handleSavePinToBoard(Number(board.id))}
          >
            <div className="flex items-center h-16">
              {board.boardCoverHash != "" ? (
                <Image
                  className="w-14 h-14 rounded-xl"
                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.boardCoverHash}`}
                  alt="board"
                  width={100}
                  height={100}
                />
              ) : (
                <>
                  {board.pins?.length > 0 && board.pins[0].imageHash ? (
                    <Image
                      className="w-14 h-14 rounded-xl"
                      src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`}
                      alt="board"
                      width={100}
                      height={100}
                    />
                  ) : (
                    <div className="bg-gray-200 w-14 h-14 rounded-xl"></div>
                  )}
                </>
              )}

              <div className="justify-center ml-4">
                <h2 className="text-lg font-bold">{board.name}</h2>
              </div>
            </div>
          </ListItem>
        ))}
      </List>
    </Modal>
  );
};

export default SavePinModal;

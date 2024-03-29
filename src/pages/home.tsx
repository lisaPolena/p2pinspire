import Head from "next/head";
import { Navbar } from "@/components/general/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { useAppState } from "@/components/general/AppStateContext";
import {
  ConnectorData,
  useAccount,
  useContractEvent,
  useContractRead,
} from "wagmi";
import boardManager from "../contracts/build/BoardManager.json";
import pinManager from "../contracts/build/PinManager.json";
import userManager from "../contracts/build/UserManager.json";
import { Board, Pin, User } from "@/common/types/structs";
import React from "react";
import { Skeleton, Stack, useToast } from "@chakra-ui/react";
import {
  clearBoardStorage,
  storeBoardsInStorage,
} from "@/common/functions/boards";
import { Toast } from "@/components/general/Toasts";
import { storeUserInStorage } from "@/common/functions/users";
import Masonry from "react-responsive-masonry";
import Image from "next/image";

export default function Home() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>([]);
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const {
    setUser,
    allBoards,
    setAllBoards,
    user,
    loadSavePinTransaction,
    setLoadSavePinTransaction,
  } = useAppState();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast();

  const { data: allBoardsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "getBoardsByOwner",
    args: [address],
    onSuccess(data) {
      setBoards(data as Board[]);
    },
  });

  const { data: allPinsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "getAllPins",
    onSuccess(data) {
      const res = data as Pin[];
      setAllPins(res);
    },
  });

  const { data: allPinsData } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "getAllPins",
    onSuccess(data) {
      setAllPins(data as Pin[]);
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "PinSaved",
    listener(log: any) {
      const args = log[0].args;
      onPinSaved(
        Number(args.pinId),
        args.title,
        args.description,
        args.imageHash,
        Number(args.boardId),
        args.owner
      );
      setLoadSavePinTransaction(0);
      handleSavedPinToast(args.imageHash, Number(args.boardId));
    },
  });

  const { data: allUsers } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: "getAllUsers",
    onSuccess(data) {
      if (!user) {
        if (data) {
          const res = data as User[];
          if (
            res.length > 0 &&
            res.find((user) => user.userAddress === address)
          ) {
            const resUser = res.find((user) => user.userAddress === address);
            if (resUser) {
              setUser({ ...resUser, id: Number(resUser.id) });
              storeUserInStorage(resUser);
            }
          }
        }
      }
    },
  });

  useEffect(() => {
    if (!isConnected && status === "unauthenticated" && !session && !user) {
      router.push("/");
    }

    getAllPins();
    getAllBoards();

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }

    return () => {
      if (activeConnector) {
        activeConnector.off("change", handleConnectorUpdate);
      }
    };
  }, [
    router,
    session,
    address,
    isConnected,
    boards,
    status,
    activeConnector,
    allPinsData,
    user,
    allUsers,
  ]);

  const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
    if (account) {
      clearBoardStorage();

      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      const text =
        "Account changed to " +
        account.slice(0, 4) +
        "..." +
        account.slice(38, account.length);
      toast({
        position: "top",
        render: () => <Toast text={text} />,
      });
    } else if (chain) {
      const text = chain.unsupported
        ? "Sry, the network is not supported!"
        : "You changed the network.";
      toast({
        position: "top",
        render: () => <Toast text={text} />,
      });
    }
  };

  function getAllPins() {
    if (allBoardsByAddress && allPinsData) {
      const boardPins = boards
        .map((board: Board) => board.pins.map((id: Pin) => Number(id)))
        .flat();
      setPins(
        allPins
          .filter(
            (pin: { owner: string; id: number }) =>
              pin.owner !== address && !boardPins.includes(Number(pin.id))
          )
          .sort((a, b) => 0.5 - Math.random())
      );
    }
  }

  function getAllBoards() {
    if (allBoardsByAddress && allPinsByAddress) {
      let updatedBoards: Board[] = [];
      if ((allBoardsByAddress as Board[]).length > 0) {
        updatedBoards = boards
          .map((board) => {
            const boardPinsIds = board.pins.map((id: Pin) => id);
            const boardPins = allPins.filter((pin: Pin) =>
              boardPinsIds.find((id) => Number(id) === Number(pin.id))
            );
            const pins = allPins.filter((pin: Pin) => pin.boardId === board.id);
            const mergedPins = [...boardPins, ...pins];
            return {
              id: Number(board.id),
              name: board.name,
              description: board.description,
              owner: board.owner,
              pins: mergedPins,
              boardCoverHash: board.boardCoverHash,
            };
          })
          .sort((a, b) => Number(a.id) - Number(b.id)) as Board[];
      }

      setAllBoards(updatedBoards);
      storeBoardsInStorage(updatedBoards);
    }
  }

  const onPinSaved = (
    pinId: number,
    title: string,
    description: string,
    imageHash: string,
    boardId: number,
    owner: string
  ) => {
    setPins((prevPins) => {
      return prevPins.filter(({ id }) => Number(id) !== pinId);
    });
    const newPin = {
      id: pinId,
      title: title,
      description: description,
      imageHash: imageHash,
      boardId: boardId,
      owner: owner,
    };
    const updatedBoards = allBoards.map((board) => {
      if (board.id === boardId) {
        return { ...board, pins: [...board.pins, newPin] };
      }
      return board;
    });

    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  function handleSavedPinToast(imageHash: string, boardId: number) {
    const boardName = allBoards.find((board) => board.id === boardId)
      ?.name as string;
    const message = "Pin saved to " + boardName;
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="h-screen overflow-auto bg-black">
        <div
          className={`fixed inset-x-0 top-0 grid grid-cols-3 bg-black h-[50px] pt-3 px-2 z-10`}
        ></div>

        <Masonry
          columnsCount={2}
          gutter={"20px"}
          className="px-4 mt-2 relative top-[50px] mb-32"
        >
          {!isLoading
            ? pins.map((pin: Pin) => (
                <React.Fragment key={pin.id}>
                  {loadSavePinTransaction &&
                  loadSavePinTransaction === Number(pin.id) ? (
                    <Stack>
                      <Skeleton height="215px" width="100%" fadeDuration={4} />
                      <Skeleton height="15px" width="70%" fadeDuration={4} />
                    </Stack>
                  ) : (
                    <div
                      key={pin.id}
                      className="h-auto"
                      onClick={() => router.push(`/pin/${pin.id}`)}
                    >
                      <Image
                        src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                        alt={pin.title}
                        className="object-cover w-full rounded-2xl max-h-72"
                        width={100}
                        height={100}
                      />
                      <div>
                        <h2 className="pt-2 pl-2 text-white font-semibold text-[0.9rem]">
                          {pin.title}
                        </h2>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              ))
            : [
                <Stack key={"0"}>
                  <Skeleton height="215px" width="100%" fadeDuration={4} />
                  <Skeleton height="15px" width="70%" fadeDuration={4} />
                </Stack>,
                <Stack key={"1"}>
                  <Skeleton height="215px" width="100%" fadeDuration={4} />
                  <Skeleton height="15px" width="70%" fadeDuration={4} />
                </Stack>,
                <Stack key={"2"}>
                  <Skeleton height="215px" width="100%" fadeDuration={4} />
                  <Skeleton height="15px" width="70%" fadeDuration={4} />
                </Stack>,
                <Stack key={"3"}>
                  <Skeleton height="215px" width="100%" fadeDuration={4} />
                  <Skeleton height="15px" width="70%" fadeDuration={4} />
                </Stack>,
                <Stack key={"4"}>
                  <Skeleton height="215px" width="100%" fadeDuration={4} />
                  <Skeleton height="15px" width="70%" fadeDuration={4} />
                </Stack>,
              ]}
        </Masonry>
      </main>
      <Navbar />
    </>
  );
}

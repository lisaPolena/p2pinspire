import Head from "next/head";
import { Navbar } from "@/components/general/Navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import {
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Skeleton,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { useAppState } from "@/components/general/AppStateContext";
import React from "react";
import {
  ConnectorData,
  useAccount,
  useContractEvent,
  useContractRead,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import boardManager from "../contracts/build/BoardManager.json";
import pinManager from "../contracts/build/PinManager.json";
import userManager from "../contracts/build/UserManager.json";
import { Pin } from "@/common/types/structs";
import { useSession } from "next-auth/react";
import { AppBar } from "@/components/general/AppBar";
import {
  clearBoardStorage,
  getBoardsFromStorage,
  storeBoardsInStorage,
} from "@/common/functions/boards";
import { Toast } from "@/components/general/Toasts";
import { clearUserStorage, getUserFromStorage } from "@/common/functions/users";
import Image from "next/image";

export default function Profile() {
  const { address, isConnected, connector: activeConnector } = useAccount();
  const { data: session, status } = useSession();
  const {
    user,
    setUser,
    allBoards,
    setAllBoards,
    loadCreateBoardTransaction,
    loadDeleteBoardTransaction,
    setLoadDeleteBoardTransaction,
    setLoadCreateBoardTransaction,
    setDeleteProfile,
  } = useAppState();
  const router = useRouter();
  const [ownPins, setOwnPins] = useState<Pin[]>([]);
  const toast = useToast();
  const [loadedFromStorage, setLoadedFromStorage] = useState<boolean>(false);

  const { data: allPinsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "getAllPins",
    onSuccess(data) {
      const res = data as Pin[];
      setOwnPins(res.filter((pin: Pin) => pin.owner === address));
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "BoardCreated",
    listener(log: any) {
      const args = log[0].args;
      onBoardCreated(
        Number(args.boardId),
        args.boardName,
        args.boardDescription,
        args.owner
      );
      setLoadCreateBoardTransaction(false);
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "BoardDeleted",
    listener(log: any) {
      const args = log[0].args;
      onBoardDeleted(Number(args.boardId));
      setLoadDeleteBoardTransaction(0);
      handleToast("Board deleted!", "");
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "BoardEdited",
    listener(log: any) {
      const args = log[0].args;
      onBoardEdited(
        Number(args.boardId),
        args.newName,
        args.newDescription,
        args.boardCoverHash
      );
      const message = args.newName + " edited!";
      handleToast(message, "");
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "PinSaved",
    listener(log: any) {
      const args = log[0].args;
      onPinCreatedOrSaved(
        Number(args.pinId),
        args.title,
        args.description,
        args.imageHash,
        Number(args.boardId),
        args.owner
      );
      handleSavedPinToast(args.imageHash, Number(args.boardId));
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    eventName: "PinCreated",
    listener(log: any) {
      const args = log[0].args;
      onPinCreatedOrSaved(
        Number(args.pinId),
        args.title,
        args.description,
        args.imageHash,
        Number(args.boardId),
        args.owner
      );
      handleSavedPinToast(args.imageHash, Number(args.boardId));
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    eventName: "CreatedPinEdited",
    listener(log: any) {
      const args = log[0].args;
      if (args.oldBoardId !== args.newBoardId) {
        onCreatedPinEdited(
          Number(args.pinId),
          args.newTitle,
          args.newDescription,
          args.imageHash,
          Number(args.oldBoardId),
          Number(args.newBoardId),
          args.owner
        );
      }
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "SavedPinEdited",
    listener(log: any) {
      const args = log[0].args;
      if (args.oldBoardId !== args.newBoardId) {
        onSavedPinEdited(
          Number(args.pinId),
          Number(args.oldBoardId),
          Number(args.newBoardId)
        );
      }
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    eventName: "PinDeleted",
    listener(log: any) {
      const args = log[0].args;
      onPinDeleted(Number(args.pinId), Number(args.boardId));
      handleToast("Pin deleted!", "");
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: "SavedPinDeleted",
    listener(log: any) {
      const args = log[0].args;
      onPinDeleted(Number(args.pinId), Number(args.boardId));
      handleToast("Pin deleted!", "");
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    eventName: "UserDeleted",
    listener(log) {
      setUser(null);
      clearUserStorage();
      router.push("/");
    },
  });

  useEffect(() => {
    if (!isConnected && status === "unauthenticated" && !session && !user) {
      router.push("/");
    }

    if (!user) {
      setUser(getUserFromStorage());
    }

    if (allBoards.length === 0 && !loadedFromStorage) {
      const storageBoards = getBoardsFromStorage();
      setAllBoards(storageBoards);
      setLoadedFromStorage(true);
    }

    if (activeConnector) {
      activeConnector.on("change", handleConnectorUpdate);
    }

    return () => {
      if (activeConnector) {
        activeConnector.off("change", handleConnectorUpdate);
      }
    };
  }, [
    isConnected,
    status,
    session,
    allBoards,
    activeConnector,
    loadedFromStorage,
  ]);

  const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
    if (account) {
      clearBoardStorage();
      router.push("/home");
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

  const onBoardCreated = (
    boardId: number,
    boardName: string,
    boardDescription: string,
    owner: string
  ) => {
    const updatedBoards = [
      ...allBoards.filter(({ id }) => Number(id) !== Number(boardId)),
      {
        id: Number(boardId),
        name: boardName,
        description: boardDescription,
        owner: owner,
        pins: [],
        boardCoverHash: "",
      },
    ].sort((a, b) => Number(a.id) - Number(b.id));

    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  const onBoardDeleted = (boardId: number) => {
    const updatedBoards = allBoards
      .filter(({ id }) => id !== boardId)
      .sort((a, b) => a.id - b.id);
    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  const onBoardEdited = (
    boardId: number,
    boardTitle: string,
    boardDescription: string,
    boardCoverHash: string
  ) => {
    const updatedBoards = allBoards.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          name: boardTitle,
          description: boardDescription,
          boardCoverHash: boardCoverHash,
        };
      }
      return board;
    });
    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  const onPinCreatedOrSaved = (
    pinId: number,
    title: string,
    description: string,
    imageHash: string,
    boardId: number,
    owner: string
  ) => {
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

  const onCreatedPinEdited = (
    pinId: number,
    title: string,
    description: string,
    imageHash: string,
    oldBoardId: number,
    newBoardId: number,
    owner: string
  ) => {
    const newPin = {
      id: pinId,
      title: title,
      description: description,
      imageHash: imageHash,
      boardId: newBoardId,
      owner: owner,
    };
    const updatedBoards = allBoards.map((board) => {
      if (board.id === oldBoardId) {
        return {
          ...board,
          pins: board.pins.filter(
            (pin: { id: number }) => Number(pin.id) !== pinId
          ),
        };
      }
      if (board.id === newBoardId) {
        return { ...board, pins: [...board.pins, newPin] };
      }
      return board;
    });

    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  const onSavedPinEdited = (
    pinId: number,
    oldBoardId: number,
    newBoardId: number
  ) => {
    const pin = allBoards
      .find((board) => board.id === oldBoardId)
      ?.pins.find((pin: { id: number }) => Number(pin.id) === pinId) as Pin;
    const updatedBoards = allBoards.map((board) => {
      if (board.id === oldBoardId) {
        return {
          ...board,
          pins: board.pins.filter((pin) => Number(pin.id) !== pinId) as Pin[],
        };
      }
      if (board.id === newBoardId) {
        return { ...board, pins: [...board.pins, pin] };
      }
      return board;
    });

    setAllBoards(updatedBoards);
    storeBoardsInStorage(updatedBoards);
  };

  const onPinDeleted = (pinId: number, boardId: number) => {
    const updatedBoards = allBoards.map((board) => {
      if (board.id === boardId) {
        return {
          ...board,
          pins: board.pins.filter((pin) => Number(pin.id) !== pinId) as Pin[],
        };
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

  function handleToast(message: string, imageHash: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="min-h-screen bg-black">
        <AppBar
          isBoard={false}
          isSavedPin={false}
          isProfile={true}
          hideBackButton={true}
        />
        <div className="absolute z-[10] top-2 left-28">
          <ConnectButton label="Connect" />
        </div>

        <div className="flex flex-col items-center justify-center pt-20">
          {user && (
            <>
              {user.profileImageHash && (
                <div className="">
                  <Image
                    src={`https://web3-pinterest.infura-ipfs.io/ipfs/${user.profileImageHash}`}
                    className="object-cover w-40 h-40 rounded-full"
                    alt="Profile Image"
                    width={100}
                    height={100}
                  />
                </div>
              )}

              {user.name && (
                <div className="mt-2 text-2xl font-bold text-white">
                  {user.name}
                </div>
              )}

              {user.username && (
                <div className="mt-2 text-sm font-medium text-gray-400">
                  @{user.username.toLowerCase()}
                </div>
              )}

              {user.bio && (
                <div className="px-6 mt-2 text-base font-medium text-white">
                  {user.bio}
                </div>
              )}

              <div className="flex items-center justify-center mt-4 space-x-4">
                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-medium text-gray-400">
                    {user.followers?.length ?? 0} Followers
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center">
                  <div className="text-sm font-medium text-gray-400">
                    {user.following?.length ?? 0} Following
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="relative flex flex-col items-center mt-6">
          <Tabs
            variant="soft-rounded"
            colorScheme="primary"
            defaultIndex={1}
            size="md"
            align="center"
          >
            <TabList>
              <Tab key={"Tab-1"}>Created</Tab>
              <Tab key={"Tab-2"}>Saved</Tab>
            </TabList>
            <TabPanels>
              <TabPanel key={"TabPanel-1"}>
                {ownPins?.length !== 0 ? (
                  <div className={`grid grid-cols-3 gap-3 px-3 mt-4 mb-16`}>
                    {ownPins.map((pin: Pin) => (
                      <div
                        key={pin.id}
                        className="h-auto"
                        onClick={() =>
                          router.push(`/pin/${pin.id}?boardId=${pin.boardId}`)
                        }
                      >
                        <Image
                          src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                          alt={pin.title}
                          className={`object-cover w-full rounded-2xl h-36`}
                          width={100}
                          height={100}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-lg font-bold">
                      You haven not created any pins yet.
                    </p>
                    <p className="text-lg font-bold">Create your first pin.</p>
                  </div>
                )}
              </TabPanel>
              <TabPanel key={"TabPanel-2"} width="100vw">
                <div className="grid grid-cols-2 gap-4 mb-16">
                  {allBoards?.map(({ id, name, pins }) => (
                    <React.Fragment key={id}>
                      {loadDeleteBoardTransaction &&
                      loadDeleteBoardTransaction === Number(id) ? (
                        <Stack>
                          <Skeleton
                            height="120px"
                            width="100%"
                            fadeDuration={4}
                          />
                          <Skeleton
                            height="10px"
                            width="70%"
                            fadeDuration={4}
                          />
                          <Skeleton height="5px" width="40%" fadeDuration={4} />
                        </Stack>
                      ) : (
                        <div
                          className="text-left"
                          onClick={() => router.push(`/boards/${name}/${id}`)}
                        >
                          <div
                            className={`h-[120px] rounded-3xl grid ${
                              (pins?.length > 1 && pins[1].imageHash) ||
                              pins?.length === 0
                                ? "grid-cols-2"
                                : "grid-cols-1"
                            } gap-x-0.5`}
                          >
                            <div className="col-span-1">
                              {pins?.length > 0 && pins[0].imageHash ? (
                                <Image
                                  className={`object-cover w-full h-[120px] ${
                                    pins.length > 1 && pins[0].imageHash
                                      ? "rounded-tl-3xl rounded-bl-3xl"
                                      : "rounded-3xl"
                                  }`}
                                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[0].imageHash}`}
                                  alt={pins[0].title}
                                  width={100}
                                  height={100}
                                />
                              ) : (
                                <div className="h-full bg-white rounded-tl-3xl rounded-bl-3xl"></div>
                              )}
                            </div>

                            <div
                              className={`grid col-span-1 ${
                                (pins?.length > 2 && pins[2].imageHash) ||
                                pins?.length === 0
                                  ? "grid-rows-2 gap-y-0.5"
                                  : "grid-rows-1"
                              } `}
                            >
                              {/* Second column content */}

                              {pins?.length > 1 && pins[1].imageHash ? (
                                <Image
                                  className={`object-cover w-full ${
                                    pins.length > 2 && pins[2].imageHash
                                      ? "h-[60px]"
                                      : "h-[120px] rounded-br-3xl"
                                  } rounded-tr-3xl`}
                                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[1].imageHash}`}
                                  alt={pins[1].title}
                                  width={100}
                                  height={100}
                                />
                              ) : (
                                <div className="h-full row-span-1 bg-white rounded-tr-3xl"></div>
                              )}

                              {pins?.length > 2 && pins[2].imageHash && (
                                <Image
                                  className={`object-cover w-full h-[60px] rounded-br-3xl`}
                                  src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[2].imageHash}`}
                                  alt={pins[2].title}
                                  width={100}
                                  height={100}
                                />
                              )}

                              {pins.length === 0 && (
                                <div className="h-full row-span-1 bg-white rounded-br-3xl"></div>
                              )}
                            </div>
                          </div>
                          <p className="pl-[0.7rem]">{name}</p>
                          <p className="text-xs text-gray-400 pl-[0.7rem]">
                            {pins?.length} Pins
                          </p>
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                  {loadCreateBoardTransaction && (
                    <Stack>
                      <Skeleton height="120px" width="100%" fadeDuration={4} />
                      <Skeleton height="10px" width="70%" fadeDuration={4} />
                      <Skeleton height="5px" width="40%" fadeDuration={4} />
                    </Stack>
                  )}
                </div>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </div>
      </main>
      <Navbar />
    </>
  );
}

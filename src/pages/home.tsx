import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { useAppState } from '@/components/general/AppStateContext';
import { ConnectorData, useAccount, useContractEvent, useContractRead } from 'wagmi';
import boardManager from '../contracts/build/BoardManager.json';
import pinManager from '../contracts/build/PinManager.json';
import { Board, Pin } from '@/common/types/structs';
import React from 'react';
import { Skeleton, Stack, useToast } from '@chakra-ui/react';
import { clearStorage, storeBoardsInStorage } from '@/common/functions/boards';
import { Toast } from '@/components/general/Toasts';

export default function Home() {
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { data: session, status } = useSession()
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>([]);
  const [allPins, setAllPins] = useState<Pin[]>([]);
  const { allBoards, setAllBoards, loadSavePinTransaction, setLoadSavePinTransaction } = useAppState();
  const [boards, setBoards] = useState<Board[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const toast = useToast()

  const { data: allBoardsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: 'getBoardsByOwner',
    args: [address],
    onSuccess(data) {
      setBoards(data as Board[]);
    },
    onError(error) {
      console.log(error);
    },
  });

  const { data: allPinsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: 'getAllPins',
    onSuccess(data) {
      const res = data as Pin[];
      setAllPins(res);
    },
  });

  const { data: allPinsData } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: 'getAllPins',
    onSuccess(data) {
      setAllPins(data as Pin[]);
    },
    onError(error) {
      console.log(error);
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: 'PinSaved',
    listener(log: any) {
      const args = log[0].args;
      onPinSaved(Number(args.pinId), args.title, args.description, args.imageHash, Number(args.boardId), args.owner);
      setLoadSavePinTransaction(0);
      handleSavedPinToast(args.imageHash, Number(args.boardId));
    },
  });

  useEffect(() => {
    if (!isConnected && status === 'unauthenticated' && !session) {
      router.push('/')
    }

    getAllPins();
    getAllBoards();

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }

    return () => {
      if (activeConnector) {
        activeConnector.off('change', handleConnectorUpdate)
      }
    }

  }, [address, isConnected, boards, status, activeConnector, allPinsData])

  const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
    if (account) {
      clearStorage();
      setIsLoading(true);
      const timeout = setTimeout(() => {
        setIsLoading(false);
      }, 2000);
      const text = 'Account changed to ' + account.slice(0, 4) + '...' + account.slice(38, account.length);
      toast({
        position: 'top',
        render: () => (
          <Toast text={text} />
        ),
      })
    } else if (chain) {
      const text = chain.unsupported ? 'Sry, the network is not supported!' : 'You changed the network.';
      toast({
        position: 'top',
        render: () => (
          <Toast text={text} />
        ),
      })
    }
  }

  function getAllPins() {
    if (allBoardsByAddress && allPinsData) {
      const boardPins = boards.map((board: any) => board.pins.map((pin: any) => pin)).flat();
      setPins(allPins.filter((pin: { owner: any; id: any; }) => pin.owner !== address && !boardPins.includes(pin.id)));
    }
  }

  function getAllBoards() {
    if (allBoardsByAddress && allPinsByAddress) {
      let updatedBoards: Board[] = [];
      if ((allBoardsByAddress as any[]).length > 0) {
        updatedBoards = boards.map((board) => {
          const boardPinsIds = board.pins.map((id: Pin) => id);
          const boardPins = allPins.filter((pin: Pin) => boardPinsIds.find((id) => Number(id) === Number(pin.id)));
          const pins = allPins.filter((pin: Pin) => pin.boardId === board.id);
          const mergedPins = [...boardPins, ...pins];
          return { id: Number(board.id), name: board.name, description: board.description, owner: board.owner, pins: mergedPins, boardCoverHash: board.boardCoverHash };
        }).sort((a, b) => Number(a.id) - Number(b.id)) as Board[];
      }

      setAllBoards(updatedBoards);
      storeBoardsInStorage(updatedBoards);
    }
  }

  const onPinSaved = (pinId: number, title: string, description: string, imageHash: string, boardId: number, owner: string) => {
    setPins((prevPins) => {
      return prevPins.filter(({ id }) => Number(id) !== pinId);
    });
    const newPin = { id: pinId, title: title, description: description, imageHash: imageHash, boardId: boardId, owner: owner };
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
    const boardName = allBoards.find((board) => board.id === boardId)?.name as string;
    const message = 'Pin saved to ' + boardName;
    toast({
      position: 'top',
      render: () => (
        <Toast text={message} imageHash={imageHash} />
      ),
    })
  }

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen overflow-auto bg-black'>
        <div className={`fixed inset-x-0 top-0 grid grid-cols-3 bg-black h-[50px] pt-3 px-2 z-10`}>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 relative top-[50px] mt-2">
          {!isLoading ? (
            <>
              {pins.map((pin: any) => (
                <React.Fragment key={pin.id}>
                  {loadSavePinTransaction && loadSavePinTransaction === Number(pin.id) ? (
                    <Stack>
                      <Skeleton height='215px' width='100%' fadeDuration={4} />
                      <Skeleton height='15px' width='70%' fadeDuration={4} />
                    </Stack>
                  ) : (
                    <div key={pin.id} className="h-auto" onClick={() => router.push(`/pin/${pin.id}`)}>
                      <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                        alt={pin.title} className="object-cover w-full rounded-2xl max-h-72" />
                      <div className='mb-4'>
                        <h2 className="pt-2 pl-2 text-white font-semibold text-[0.9rem]">{pin.title}</h2>
                      </div>
                    </div>
                  )}
                </React.Fragment>

              ))}
            </>
          ) : (
            <>
              <Stack>
                <Skeleton height='215px' width='100%' fadeDuration={4} />
                <Skeleton height='15px' width='70%' fadeDuration={4} />
              </Stack>
              <Stack>
                <Skeleton height='215px' width='100%' fadeDuration={4} />
                <Skeleton height='15px' width='70%' fadeDuration={4} />
              </Stack>
              <Stack>
                <Skeleton height='215px' width='100%' fadeDuration={4} />
                <Skeleton height='15px' width='70%' fadeDuration={4} />
              </Stack>
              <Stack>
                <Skeleton height='215px' width='100%' fadeDuration={4} />
                <Skeleton height='15px' width='70%' fadeDuration={4} />
              </Stack>
              <Stack>
                <Skeleton height='215px' width='100%' fadeDuration={4} />
                <Skeleton height='15px' width='70%' fadeDuration={4} />
              </Stack>
            </>
          )}
        </div>
      </main>
      <Navbar />
    </>
  )
}

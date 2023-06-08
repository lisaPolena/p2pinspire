import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { useSession } from "next-auth/react"
import { useAppState } from '@/components/general/AppStateContext';
import { ConnectorData, useAccount, useContractEvent, useContractRead } from 'wagmi';
import boardManager from '../contracts/build/BoardManager.json';
import pinManager from '../contracts/build/PinManager.json';
import { Board, Pin } from '@/common/types/structs';
import React from 'react';
import { Skeleton, Stack } from '@chakra-ui/react';

export default function Home() {
  const { address, isConnected, connector: activeConnector } = useAccount()
  const { data: session, status } = useSession()
  const router = useRouter();
  const [pins, setPins] = useState<Pin[]>([]);
  const [notOwnPins, setNotOwnPins] = useState<Pin[]>([]);
  const { allBoards, setAllBoards, loadSavePinTransaction, setLoadSavePinTransaction } = useAppState();
  const [boards, setBoards] = useState<Board[]>([]);

  const { data: allBoardsByAddress } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: 'getBoardsByOwner',
    args: [address],
    onSuccess(data) {
      setBoards(data as Board[]);
    },
  });

  const { data: allPins } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: 'getAllPins',
    onSuccess(data) {
      const res = data as Pin[];
      setNotOwnPins(res.filter((pin: Pin) => pin.owner !== address));
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    eventName: 'PinSaved',
    listener(log: any) {
      const args = log[0].args;
      console.log(args);
      onPinSaved(Number(args.pinId));
      setLoadSavePinTransaction(0);
    },
  });

  useEffect(() => {
    if (!isConnected && status === 'unauthenticated' && !session) {
      router.push('/')
    }

    getAllPins();

    const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
      if (account) {
        //TODO: workaround 
        window.location.reload();
      } else if (chain) {
        console.log('new chain', chain)
      }
    }

    if (activeConnector) {
      activeConnector.on('change', handleConnectorUpdate)
    }

    return () => {
      if (activeConnector) {
        activeConnector.off('change', handleConnectorUpdate)
      }
    }

  }, [address, isConnected, boards, status, activeConnector])

  function getAllPins() {
    if (allBoardsByAddress && allPins) {
      const boardPins = boards.map((board: any) => board.pins.map((pin: any) => pin)).flat();
      setPins(notOwnPins.filter((pin: { owner: any; id: number; }) => pin.owner !== address && !boardPins.includes(pin.id)));
    }
  }

  const onPinSaved = (pinId: number) => {
    setPins((prevPins) => {
      return prevPins.filter(({ id }) => Number(id) !== pinId);
    });
  };

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
        </div>

      </main>
      <Navbar />
    </>
  )
}

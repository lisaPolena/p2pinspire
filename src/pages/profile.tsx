import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Skeleton, Stack } from '@chakra-ui/react';
import { useAppState } from '@/components/general/AppStateContext';
import React from 'react';
import { ConnectorData, useAccount, useContractEvent, useContractRead } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import boardManager from '../contracts/build/BoardManager.json';
import pinManager from '../contracts/build/PinManager.json';
import { Board, Pin } from '@/common/types/structs';
import { useSession } from "next-auth/react"
import { watchAccount } from '@wagmi/core'
import { AppBar } from '@/components/general/AppBar';

export default function Profile() {
    const { address, isConnected, connector: activeConnector } = useAccount()
    const { data: session, status } = useSession()
    const [boards, setBoards] = useState<any[]>([]);
    const [allBoards, setAllBoards] = useState<Board[]>([]);
    const [allPins, setAllPins] = useState<Pin[]>([]);
    const { loadCreateBoardTransaction, loadDeleteBoardTransaction, setLoadDeleteBoardTransaction, setLoadCreateBoardTransaction } = useAppState();
    const router = useRouter();
    const [ownPins, setOwnPins] = useState<any[]>([]);

    const { data: allBoardsByAddress } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardsByOwner',
        args: [address],
        onSuccess(data) {
            setAllBoards(data as Board[]);
        },
    });

    const { data: allPinsByAddress } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'getAllPins',
        onSuccess(data) {
            const res = data as Pin[];
            setAllPins(res);
            setOwnPins(res.filter((pin: Pin) => pin.owner === address));
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'BoardCreated',
        listener(log: any) {
            const args = log[0].args;
            onBoardCreated(Number(args.boardId), args.boardName, args.owner);
            setLoadCreateBoardTransaction(false);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'BoardDeleted',
        listener(log: any) {
            const args = log[0].args
            onBoardDeleted(Number(args.boardId))
            setLoadDeleteBoardTransaction(0);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'PinSaved',
        listener(log: any) {
            const args = log[0].args;
            onPinCreatedOrSaved(Number(args.pinId), args.title, args.description, args.imageHash, Number(args.boardId), args.owner);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'PinCreated',
        listener(log: any) {
            const args = log[0].args;
            onPinCreatedOrSaved(Number(args.pinId), args.title, args.description, args.imageHash, Number(args.boardId), args.owner);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'CreatedPinEdited',
        listener(log: any) {
            const args = log[0].args;
            if (args.oldBoardId !== args.newBoardId) {
                onCreatedPinEdited(Number(args.pinId), args.newTitle, args.newDescription, args.imageHash, Number(args.oldBoardId), Number(args.newBoardId), args.owner);
            }
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'SavedPinEdited',
        listener(log: any) {
            const args = log[0].args;
            if (args.oldBoardId !== args.newBoardId) {
                onSavedPinEdited(Number(args.pinId), Number(args.oldBoardId), Number(args.newBoardId));
            }
        },
    });

    useEffect(() => {
        if (!isConnected && status === 'unauthenticated' && !session) {
            router.push('/')
        }

        getAllBoards();

        const handleConnectorUpdate = ({ account, chain }: ConnectorData) => {
            if (account) {
                console.log('new account', account)
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

    }, [isConnected, status, session, allBoardsByAddress, allPinsByAddress, allBoards, activeConnector])

    const onBoardCreated = (boardId: number, boardName: string, owner: string) =>
        setBoards((prevBoards) => {
            return [...prevBoards.filter(({ id }) => Number(id) !== Number(boardId)), { id: Number(boardId), name: boardName, owner: owner, pins: [] }]
                .sort((a, b) => Number(a.id) - Number(b.id));
        });

    const onBoardDeleted = (boardId: number) => {
        setBoards((prevBoards) => {
            return prevBoards.filter(({ id }) => id !== boardId).sort((a, b) => a.id - b.id);;
        });
    };

    const onPinCreatedOrSaved = (pinId: number, title: string, description: string, imageHash: string, boardId: number, owner: string) => {
        const newPin = { id: pinId, title: title, description: description, imageHash: imageHash, boardId: boardId, owner: owner };
        setBoards((prevBoards) => {
            return prevBoards.map((board) => {
                if (board.id === boardId) {
                    return { ...board, pins: [...board.pins, newPin] };
                }
                return board;
            });
        });
    };

    const onCreatedPinEdited = (pinId: number, title: string, description: string, imageHash: string, oldBoardId: number, newBoardId: number, owner: string) => {
        const newPin = { id: pinId, title: title, description: description, imageHash: imageHash, boardId: newBoardId, owner: owner };
        setBoards((prevBoards) => {
            return prevBoards.map((board) => {
                if (board.id === oldBoardId) {
                    return { ...board, pins: board.pins.filter((pin: { id: number; }) => Number(pin.id) !== pinId) };
                }
                if (board.id === newBoardId) {
                    return { ...board, pins: [...board.pins, newPin] };
                }
                return board;
            });
        });
    };

    const onSavedPinEdited = (pinId: number, oldBoardId: number, newBoardId: number) => {
        setBoards((prevBoards) => {
            const pin = prevBoards.find((board) => board.id === oldBoardId)?.pins.find((pin: { id: number; }) => Number(pin.id) === pinId);
            return prevBoards.map((board) => {
                if (board.id === oldBoardId) {
                    return { ...board, pins: board.pins.filter((pin: { id: number; }) => Number(pin.id) !== pinId) };
                }
                if (board.id === newBoardId) {
                    return { ...board, pins: [...board.pins, pin] };
                }
                return board;
            });
        });
    };

    function getAllBoards() {
        if (allBoards.length === 0) {
            setBoards([]);
            return;
        }

        if (allBoardsByAddress && allPinsByAddress) {
            allBoards.map((board: Board) => {
                const boardPins = allPins.filter((pin: Pin) => board.pins.find((pinId: number) => Number(pinId) === Number(pin.id)));
                const pins = allPins.filter((pin: Pin) => pin.boardId === board.id);
                const mergedPins = [...boardPins, ...pins];
                setBoards((prevBoards) => {
                    return [...prevBoards.filter(({ id, owner }) => Number(id) !== Number(board.id) && owner === address), { id: Number(board.id), name: board.name, owner: board.owner, pins: mergedPins }]
                        .sort((a, b) => Number(a.id) - Number(b.id));
                });
            });
        }
    }

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main className='min-h-screen bg-black'>
                <AppBar isBoard={false} isSavedPin={false} hideBackButton={true} />
                <div className='w-[95%] flex flex-col justify-center items-center mb-10 relative top-20'>
                    <ConnectButton label='Connect' />
                </div>

                <div className='relative flex flex-col items-center top-20'>
                    <Tabs variant='soft-rounded' colorScheme='primary' defaultIndex={1} size='md' align='center'>
                        <TabList>
                            <Tab key={'Tab-1'}>Created</Tab>
                            <Tab key={'Tab-2'}>Saved</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel key={'TabPanel-1'}>
                                {ownPins?.length !== 0 ? (
                                    <div className={`grid grid-cols-3 gap-3 px-3 mt-4`}>
                                        {ownPins.map((pin: any) => (
                                            <div key={pin.id} className="h-auto" onClick={() => router.push(`/pin/${pin.id}?boardId=${pin.boardId}`)}>
                                                <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                                                    alt={pin.title} className={`object-cover w-full rounded-2xl h-36`} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className='flex flex-col items-center justify-center'>
                                        <p className='text-lg font-bold'>You haven't created any pins yet.</p>
                                        <p className='text-lg font-bold'>Create your first pin.</p>
                                    </div>
                                )}
                            </TabPanel>
                            <TabPanel key={'TabPanel-2'} width='100vw'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {boards?.map(({ id, name, pins }) => (
                                        <React.Fragment key={id}>
                                            {loadDeleteBoardTransaction && loadDeleteBoardTransaction === Number(id) ? (
                                                <Stack>
                                                    <Skeleton height='120px' width='100%' fadeDuration={4} />
                                                    <Skeleton height='10px' width='70%' fadeDuration={4} />
                                                    <Skeleton height='5px' width='40%' fadeDuration={4} />
                                                </Stack>
                                            ) : (
                                                <div className='text-left' onClick={() => router.push(`/boards/${name}/${id}`)}>
                                                    <div className={`h-[120px] rounded-3xl grid ${(pins?.length > 1 && pins[1].imageHash) || pins?.length === 0 ? 'grid-cols-2' : 'grid-cols-1'} gap-x-0.5`}>

                                                        <div className='col-span-1'>
                                                            {pins?.length > 0 && pins[0].imageHash ? (
                                                                <img className={`object-cover w-full h-[120px] ${pins.length > 1 && pins[0].imageHash ? 'rounded-tl-3xl rounded-bl-3xl' : 'rounded-3xl'}`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[0].imageHash}`} />
                                                            ) : (
                                                                <div className='h-full bg-white rounded-tl-3xl rounded-bl-3xl'>
                                                                </div>
                                                            )}
                                                        </div>

                                                        <div className={`grid col-span-1 ${(pins?.length > 2 && pins[2].imageHash) || pins?.length === 0 ? 'grid-rows-2 gap-y-0.5' : 'grid-rows-1'} `}>
                                                            {/* Second column content */}

                                                            {pins?.length > 1 && pins[1].imageHash ? (
                                                                <img className={`object-cover w-full ${pins.length > 2 && pins[2].imageHash ? 'h-[60px]' : 'h-[120px] rounded-br-3xl'} rounded-tr-3xl`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[1].imageHash}`} />
                                                            ) : (
                                                                <div className='h-full row-span-1 bg-white rounded-tr-3xl'></div>
                                                            )}

                                                            {pins?.length > 2 && pins[2].imageHash && (
                                                                <img className={`object-cover w-full h-[60px] rounded-br-3xl`} src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pins[2].imageHash}`} />
                                                            )}

                                                            {pins.length === 0 && (
                                                                <div className='h-full row-span-1 bg-white rounded-br-3xl'></div>
                                                            )}

                                                        </div>

                                                    </div>
                                                    <p className='pl-[0.7rem]'>{name}</p>
                                                    <p className='text-xs text-gray-400 pl-[0.7rem]'>{pins?.length} Pins</p>
                                                </div>
                                            )}
                                        </React.Fragment>
                                    ))}
                                    {loadCreateBoardTransaction &&
                                        <Stack>
                                            <Skeleton height='120px' width='100%' fadeDuration={4} />
                                            <Skeleton height='10px' width='70%' fadeDuration={4} />
                                            <Skeleton height='5px' width='40%' fadeDuration={4} />
                                        </Stack>
                                    }
                                </div>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>
            </main>
            <Navbar />
        </>
    )
}

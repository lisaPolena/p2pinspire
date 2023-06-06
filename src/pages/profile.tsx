import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Skeleton, Stack } from '@chakra-ui/react';
import { useAppState } from '@/components/general/AppStateContext';
import React from 'react';
import { useAccount, useContractEvent, useContractRead } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import boardManager from '../contracts/build/BoardManager.json';
import pinManager from '../contracts/build/PinManager.json';
import { Board, Pin } from '@/common/types/structs';

export default function Profile() {
    const { address, isConnected } = useAccount()
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

    //TODO: does not work, der listener wird schon ausgeführt bevor die transaction fertig ist
    const unwatchBoardCreated = useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'BoardCreated',
        listener(log) {
            console.log(log)
            getAllBoards();
            setLoadCreateBoardTransaction(false);
        },
    });

    const unwatchBoardDeleted = useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'BoardDeleted',
        listener(log) {
            //TODO: es hört auf zu laden aber das gelöschte board ist noch da
            if (log) {
                getAllBoards();
                setLoadDeleteBoardTransaction(0);
            }
        },
    });

    const unwatchPinSaved = useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'PinSaved',
        listener(log) {
            console.log(log)
            getAllBoards();
        },
    });

    //TODO: does not work es macht es zwar aber bei getAllBoards sind die neuen noch nicht dabei...
    const unwatchPinCreated = useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'PinCreated',
        listener(log) {
            console.log(log)
            if (log) getAllBoards();
        },
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isConnected) router.push('/');
        }, 2000);

        getAllBoards();

        return () => {
            clearTimeout(timeoutId);
        }
    }, [isConnected, address, loadCreateBoardTransaction, loadDeleteBoardTransaction, allBoardsByAddress, allPinsByAddress, allBoards])

    const onBoardCreated = (boardId: number, boardName: string, owner: string) =>
        setBoards((prevBoards) => {
            return [...prevBoards.filter(({ id }) => id !== boardId), { id: boardId, name: boardName, owner: owner, pins: [] }]
                .sort((a, b) => a.id - b.id);
        });;

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
            <main className='min-h-screen bg-black mb-18'>
                <div className='w-[95%] flex flex-col justify-center items-center'>
                    <ConnectButton accountStatus={'avatar'} />
                </div>

                <div className='flex flex-col items-center'>
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

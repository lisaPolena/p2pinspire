import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Skeleton, Stack } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager, usePinManager } from '@/common/functions/contracts';
import { useAppState } from '@/components/general/AppStateContext';

export default function Profile() {
    // active: returns a boolean to check if user is connected
    // account: returns the users account (or .eth name)
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    const { active, account, library } = useWeb3React<Web3Provider>()
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const [boards, setBoards] = useState<any[]>([]);
    const { loadCreateBoardTransaction, loadDeleteBoardTransaction, setLoadDeleteBoardTransaction } = useAppState();
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!active) router.push('/');
        }, 2000);

        getAllBoards();

        if (boardCreatedEvent) boardManagerContract?.on(boardCreatedEvent, onBoardCreated);
        boardManagerContract?.on('BoardDeleted', handleBoardDeleted);

        return () => {
            clearTimeout(timeoutId);
            if (boardCreatedEvent) boardManagerContract?.off(boardCreatedEvent, onBoardCreated);
            boardManagerContract?.off('BoardDeleted', handleBoardDeleted);
        }
    }, [active, account, loadCreateBoardTransaction, loadDeleteBoardTransaction])

    const boardCreatedEvent = boardManagerContract?.filters.BoardCreated(null, null, account);

    const onBoardCreated = (boardId: number, boardName: string, owner: string) =>
        setBoards((prevBoards) => {
            return [...prevBoards.filter(({ id }) => id !== boardId), { id: boardId, name: boardName, owner: owner, pins: [] }]
                .sort((a, b) => a.id - b.id);
        });

    const handleBoardDeleted = () => {
        getAllBoards();
        setLoadDeleteBoardTransaction(0);
    };

    function getAllBoards() {
        boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
            const boards = result.map((board: any) => ({ id: board.id.toNumber(), name: board.name, owner: board.owner, pins: board.pins }));
            getAllPinsByBoard(boards);
        });
    }

    //TODO: ugly af, fix this
    function getAllPinsByBoard(boards: any) {
        boards.forEach((board: any) => {
            pinManagerContract?.getPinsByBoardId(board.id).then((result: any) => {
                let pins = result.map((pin: any) => ({ id: pin.id.toNumber(), title: pin.title, description: pin.description, owner: pin.owner, imageHash: pin.imageHash, boardId: pin.boardId.toNumber() }));
                board.pins.forEach((pinId: any) => {
                    pinManagerContract.getPinById(pinId.toNumber()).then((result: any) => {
                        pins = [...pins, { id: result.id.toNumber(), title: result.title, description: result.description, owner: result.owner, imageHash: result.imageHash, boardId: result.boardId.toNumber() }]
                        setBoards((prevBoards) => {
                            return [...prevBoards.filter(({ id, owner }) => id !== board.id && owner === board.owner), { id: board.id, name: board.name, owner: board.owner, pins: pins }]
                                .sort((a, b) => a.id - b.id);
                        });
                    });
                });
                setBoards((prevBoards) => {
                    return [...prevBoards.filter(({ id, owner }) => id !== board.id && owner === board.owner), { id: board.id, name: board.name, owner: board.owner, pins: pins }]
                        .sort((a, b) => a.id - b.id);
                });
            });
        });
    }

    return (
        <>
            <Head>
                <title>Profile</title>
            </Head>
            <main className='min-h-screen bg-black mb-18'>
                <div className='w-[95%] flex flex-col justify-center items-center'>
                    {account && <p className='text-lg font-bold'>{account.slice(0, 5)}...${account.slice(-4)}</p>}
                </div>

                <div className='flex flex-col items-center'>
                    <Tabs variant='soft-rounded' colorScheme='primary' defaultIndex={1} size='md' align='center'>
                        <TabList>
                            <Tab key={'Tab-1'}>Created</Tab>
                            <Tab key={'Tab-2'}>Saved</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel key={'TabPanel-1'}>
                                <p>one!</p>
                            </TabPanel>
                            <TabPanel key={'TabPanel-2'} width='100vw'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {boards?.map(({ id, name, owner, pins }) => (
                                        <>
                                            {loadDeleteBoardTransaction && loadDeleteBoardTransaction === id.toNumber() ? (
                                                <Stack key={id}>
                                                    <Skeleton key={'1-' + id} height='120px' width='100%' fadeDuration={4} />
                                                    <Skeleton key={'2-' + id} height='10px' width='70%' fadeDuration={4} />
                                                    <Skeleton key={'3-' + id} height='5px' width='40%' fadeDuration={4} />
                                                </Stack>
                                            ) : (
                                                <div key={'0-' + id} className='text-left' onClick={() => router.push(`/boards/${name}/${id}`)}>
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
                                        </>
                                    ))}
                                    {loadCreateBoardTransaction &&
                                        <Stack>
                                            <Skeleton key={'100'} height='120px' width='100%' fadeDuration={4} />
                                            <Skeleton key={'101'} height='10px' width='70%' fadeDuration={4} />
                                            <Skeleton key={'102'} height='5px' width='40%' fadeDuration={4} />
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

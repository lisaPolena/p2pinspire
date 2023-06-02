import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel, Skeleton, Stack } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager } from '@/common/functions/contracts';
import { useAppState } from '@/components/general/AppStateContext';
import { LoadingOverlay } from '@/components/overlays/LoadingOverlay';

export default function Profile() {
    // active: returns a boolean to check if user is connected
    // account: returns the users account (or .eth name)
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    const { active, account, library } = useWeb3React<Web3Provider>()
    const boardManagerContract = useBoardManager(library);
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
    }, [active, loadCreateBoardTransaction, loadDeleteBoardTransaction])

    const boardCreatedEvent = boardManagerContract?.filters.BoardCreated(null, null, account);

    const onBoardCreated = (boardId: number, boardName: string, owner: string) =>
        setBoards((prevBoards) => {
            return [...prevBoards.filter(({ id }) => id !== boardId), { id: boardId, name: boardName, owner: owner, pins: [] }]
                .sort((a, b) => a.id - b.id);
        });

    const handleBoardDeleted = (boardId: number) => {
        getAllBoards();
        setLoadDeleteBoardTransaction(false);
    };

    function getAllBoards() {
        boardManagerContract?.getAllBoards().then((result: any) => {
            setBoards(result);
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
                            <Tab>Created</Tab>
                            <Tab>Saved</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <p>one!</p>
                            </TabPanel>
                            <TabPanel width='100vw'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {boards?.map(({ id, name, owner, pins }) => (
                                        <div key={id} className='text-left' onClick={() => router.push(`/boards/${name}/${id}`)}>
                                            <div className='h-[120px] bg-white rounded-3xl'>
                                            </div>
                                            <p className='pl-[0.7rem]'>{name}</p>
                                            <p className='text-xs text-gray-400 pl-[0.7rem]'>{pins?.length} Pins</p>
                                        </div>
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
                {loadDeleteBoardTransaction && <LoadingOverlay />}
            </main>
            <Navbar />
        </>
    )
}

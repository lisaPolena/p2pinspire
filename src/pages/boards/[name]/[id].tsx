import { Board, Pin } from '@/common/types/structs';
import { AppBar } from '@/components/general/AppBar';
import { useAppState } from '@/components/general/AppStateContext';
import { Spinner } from '@chakra-ui/react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useContractEvent, useContractRead } from 'wagmi';
import pinManager from '../../../contracts/build/PinManager.json';
import boardManager from '../../../contracts/build/BoardManager.json';

export default function DetailBoard() {
    const { address, isConnected } = useAccount()
    const [board, setBoard] = useState<Board | null>(null);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const router = useRouter()
    const [pins, setPins] = useState<Pin[]>([]);
    const [tmpPins, setTmpPins] = useState<Pin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { boardView } = useAppState();

    const { data: boardById } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardById',
        args: [router.query.id],
        onSuccess(data) {
            const res = data as Board;
            setBoard(res);
        },
    });

    const { data: allPins } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'getAllPins',
        onSuccess(data) {
            const res = data as Pin[];
            setTmpPins(res);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'BoardEdited',
        listener(log: any) {
            const args = log[0].args;
            const newBoard = { ...board, name: args.newName } as Board;
            setBoard(newBoard);
        },
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isConnected) router.push('/');
        }, 2000);

        getPinsByBoardId();

        if (board && board.owner !== address)
            router.push('/profile');

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowTitle(scrollPosition > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            clearTimeout(timeoutId);
            window.removeEventListener('scroll', handleScroll);
        };

    }, [router.query, board, allPins, boardById, isConnected, address])

    function getPinsByBoardId() {
        if (boardById && board && allPins) {
            const boardPins = tmpPins.filter((pin: Pin) => board.pins.find((pinId: number) => Number(pinId) === Number(pin.id)));
            const pins = tmpPins.filter((pin: Pin) => pin.boardId === board.id);
            const mergedPins = [...boardPins, ...pins];
            setPins(mergedPins);
            setIsLoading(false);
        }
    }

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={true} isSavedPin={false} title={board ? board.name : ''} showTitle={showTitle} board={board} />
                {board ? (
                    <div className='relative top-[50px]'>
                        <div className='mt-10 mb-10 text-center'>
                            <h1 className="text-3xl font-bold text-white mx-auto break-normal max-w-[12rem]">
                                {board ? board.name : ''}
                            </h1>
                        </div>
                        {!isLoading ? (
                            <>
                                <div>
                                    <p className='text-[1.2rem] ml-[1.3rem] mb-[0.4rem] font-semibold'>{pins && pins.length ? pins.length + ' Pins' : '0 Pins'}</p>
                                </div>
                                <div className={`grid ${boardView === 'wide' ? 'grid-cols-1' : (boardView === 'compact' ? 'grid-cols-3' : 'grid-cols-2')} gap-3 px-4`}>
                                    {pins.map((pin: any) => (
                                        <div key={pin.id} className="h-auto" onClick={() => router.push(`/pin/${pin.id}?boardId=${board.id}`)}>
                                            <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                                                alt={pin.title} className={`object-cover w-full rounded-2xl ${boardView === 'wide' ? 'max-h-96' : (boardView === 'compact' ? 'max-h-40' : 'max-h-72')}`} />
                                            <div className='mb-2'>
                                                <h2 className="pt-2 pl-2 text-white font-semibold text-[0.9rem]">{pin.title}</h2>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </>

                        ) : (
                            <div className='flex items-center justify-center h-[60vh]'>
                                <Spinner
                                    thickness='4px'
                                    speed='0.65s'
                                    emptyColor='gray.200'
                                    color='blue.500'
                                    size='xl'
                                />
                            </div>
                        )}
                    </div>
                ) : (
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                )}
            </main>


        </>
    )
}

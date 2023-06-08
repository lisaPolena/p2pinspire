import { Board, Pin } from '@/common/types/structs';
import { AppBar } from '@/components/general/AppBar';
import { useAppState } from '@/components/general/AppStateContext';
import { Spinner } from '@chakra-ui/react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useMemo, useState } from 'react'
import { useAccount, useContractEvent, useContractRead } from 'wagmi';
import pinManager from '../../../contracts/build/PinManager.json';
import boardManager from '../../../contracts/build/BoardManager.json';
import { IoAdd } from "react-icons/io5";
import AddModal from '@/components/overlays/AddModal';
import CreatePinModal from '@/components/overlays/CreatePinModal';
import { getBoardsFromStorage, storeBoardsInStorage } from '@/common/functions/boards';

export default function DetailBoard() {
    const { address, isConnected } = useAccount()
    const [board, setBoard] = useState<Board | null>(null);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const router = useRouter()
    const [pins, setPins] = useState<Pin[]>([]);
    const [tmpPins, setTmpPins] = useState<Pin[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const { allBoards, setAllBoards, boardView, setAddModalOpen } = useAppState();

    const { data: boardById } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardById',
        args: [router.query.id],
        onSuccess(data) {
            const res = data as Board;
            setBoard(res);
        },
        onError(err) {
            if (err.message.includes('Board does not exist.')) {
                console.log('Board does not exist.');
                router.push('/profile');
            }
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
            const newBoard = { id: args.boardId, name: args.newName, description: args.newDescription, owner: args.owner, pins: args.pins, boardCoverHash: args.boardCoverHash } as Board;
            setBoard(newBoard);
            onBoardEdited(Number(args.boardId), args.newName, args.newDescription, args.boardCoverHash);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'PinDeleted',
        listener(log: any) {
            const args = log[0].args;
            onPinDeleted(Number(args.pinId), Number(args.boardId));
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        eventName: 'SavedPinDeleted',
        listener(log: any) {
            const args = log[0].args;
            onPinDeleted(Number(args.pinId), Number(args.boardId));
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'PinCreated',
        listener(log: any) {
            const args = log[0].args;
            onPinCreated(Number(args.pinId), args.title, args.description, args.imageHash, args.boardId, args.owner);
        },
    });

    useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'CreatedPinEdited',
        listener(log: any) {
            const args = log[0].args;
            const boardId = args.newBoardId ?? args.oldBoardId;
            onPinEdited(Number(args.pinId), args.newTitle, args.newDescription, args.imageHash, Number(boardId));
        },
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isConnected) router.push('/');
        }, 2000);

        getPinsByBoardId();

        if (allBoards.length === 0) {
            const storageBoards = getBoardsFromStorage();
            setAllBoards(storageBoards);
        }

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
            const boardPinsIds = board.pins.map((id: Pin) => id)
            const boardPins = tmpPins.filter((pin: Pin) => boardPinsIds.find((id) => Number(id) === Number(pin.id)));
            const pins = tmpPins.filter((pin: Pin) => pin.boardId === board.id);
            const mergedPins = [...boardPins, ...pins];
            setPins(mergedPins);
            setIsLoading(false);
        }
    }

    const onPinDeleted = (pinId: number, boardId: number) => {
        setPins((prevPins) => {
            return prevPins.filter(({ id }) => Number(id) !== pinId);
        });

        const updatedBoards = allBoards.map((board) => {
            if (board.id === boardId) {
                return { ...board, pins: board.pins.filter((pin) => Number(pin.id) !== pinId) as Pin[] };
            }
            return board;
        });

        setAllBoards(updatedBoards);
        storeBoardsInStorage(updatedBoards);
    };

    const onPinCreated = (pinId: number, title: string, description: string, imageHash: string, boardId: number, owner: string) => {
        const newPin = { id: pinId, title: title, description: description, imageHash: imageHash, boardId: boardId, owner: owner };
        setPins((prevPins) => {
            return [...prevPins.filter(({ id }) => Number(id) !== Number(boardId)), newPin]
                .sort((a, b) => Number(a.id) - Number(b.id));
        });
    };

    const onPinEdited = (pinId: number, title: string, description: string, imageHash: string, boardId: number) => {
        setPins((prevPins) => {
            const updatedPins = prevPins.map((pin) => {
                if (Number(pin.id) === pinId) {
                    return { ...pin, title, description, imageHash, boardId };
                }
                return pin;
            });

            return updatedPins.sort((a, b) => Number(a.id) - Number(b.id));
        });
    };

    const onBoardEdited = (boardId: number, boardTitle: string, boardDescription: string, boardCoverHash: string) => {
        const updatedBoards = allBoards.map((board) => {
            if (board.id === boardId) {
                return { ...board, name: boardTitle, description: boardDescription, boardCoverHash: boardCoverHash };
            }
            return board;
        });
        setAllBoards(updatedBoards);
        storeBoardsInStorage(updatedBoards);
    };

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={true} isSavedPin={false} title={board ? board.name : ''} showTitle={showTitle} board={board} pins={pins} />
                {board ? (
                    <div className='relative top-[50px]'>
                        <div className='mt-10 mb-10 text-center'>
                            <h1 className="text-3xl font-bold text-white mx-auto break-normal max-w-[20rem]">
                                {board.name ?? ''}
                            </h1>
                            {board.description &&
                                <>
                                    <hr className='w-2/4 m-auto mt-4'></hr>
                                    <div className='px-6 mt-4'>
                                        <p className='text-sm text-tertiary'>{board.description}</p>
                                    </div>
                                </>
                            }
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
                <button onClick={() => setAddModalOpen(true)} className='flex fixed w-[50px] h-[50px] rounded-full bottom-5 left-[45vw] bg-secondary items-center justify-center'>
                    <IoAdd color='white' size={30} />
                </button>
            </main>
            <AddModal />
            <CreatePinModal boardId={board ? Number(board.id) : null} />
        </>
    )
}



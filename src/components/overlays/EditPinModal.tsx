import React, { useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, List, ListItem, Slide } from '@chakra-ui/react';
import DeleteModal from './DeleteModal';
import { useRouter } from 'next/router';
import boardManager from '../../contracts/build/BoardManager.json';
import pinManager from '../../contracts/build/PinManager.json';
import { useAccount, useContractWrite } from 'wagmi';
import { Board } from '@/common/types/structs';
import { IoChevronBack, IoCheckmarkSharp, IoChevronForward } from "react-icons/io5";

interface EditPinModalProps {
    pin: any;
}

const EditBoardModal: React.FC<EditPinModalProps> = (props: EditPinModalProps) => {
    const { pin } = props;
    const { address, isConnected } = useAccount()
    const { allBoards, editPinModalOpen, setEditPinModalOpen, deletePinModalOpen, setDeletePinModalOpen } = useAppState();
    const [pinTitle, setPinTitle] = useState<string>('');
    const [pinDescription, setPinDescripton] = useState<string>('');
    const [pinBoardId, setPinBoardId] = useState<string | number>('');
    const [newPinBoardId, setNewPinBoardId] = useState<string | number>('');
    const [isOwner, setIsOwner] = useState<boolean>(false);
    const router = useRouter();
    const [boardSlideOpen, setBoardSlideOpen] = useState<boolean>(false);
    const [board, setBoard] = useState<any>(null);

    const {
        data: savedPinData,
        status: editSavedPinStatus,
        writeAsync: writeEditSavedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'editSavedPin',
        onError(err) {
            console.log('err.prepare: ', err);
        }
    })

    const {
        data: createdPinData,
        status: editCreatedPinStatus,
        writeAsync: writeEditCreatedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'editCreatedPin',
        onError(err) {
            console.log('error ', err);
        }
    })

    useEffect(() => {
        const { boardId } = router.query;

        if (pin && pin.owner === address) {
            setIsOwner(true);
            setPinTitle(pin.title);
            setPinDescripton(pin.description);
            setPinBoardId(Number(pin.boardId));
            if (pin.boardId && !newPinBoardId) {
                const b = allBoards.find(board => board.id === Number(pin.boardId) ?? null);
                setBoard(b);
            }
        } else {
            setIsOwner(false);
            setPinBoardId(Number(boardId));
            if (boardId && !newPinBoardId) {
                const b = allBoards.find(board => board.id === Number(boardId) ?? null);
                setBoard(b);
            }
        }

    }, [pin, address, editSavedPinStatus, editCreatedPinStatus, newPinBoardId, router.query]);

    //TODO created edit pin event 
    async function editCreatedPin() {
        await writeEditCreatedPin({ args: [pin.id as string, pinTitle, pinDescription, newPinBoardId != '' ? newPinBoardId : pinBoardId] })
        setEditPinModalOpen(false);
        setNewPinBoardId('');
        if (newPinBoardId != '') router.push('/profile');
    }

    //TODO saved edit pin event 
    const editSavedPin = async () => {
        if (newPinBoardId !== '') {
            await writeEditSavedPin({ args: [pin.id as string, pinBoardId, newPinBoardId] })
        }
        setEditPinModalOpen(false);
        setNewPinBoardId('');
        router.push('/profile');
    }

    const handleNewBoard = (board: Board) => {
        setNewPinBoardId(Number(board.id));
        setBoardSlideOpen(false);
        setBoard(board);
    }

    return (
        <>
            {deletePinModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editPinModalOpen} closeModal={() => setEditPinModalOpen(false)} title="Edit Pin" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={(isOwner && pinTitle?.length === 0) || (!isOwner && (newPinBoardId !== '' ? pinBoardId === newPinBoardId : newPinBoardId === ''))}
                        onClick={isOwner ? () => editCreatedPin() : () => editSavedPin()}
                    >
                        Done
                    </button>
                </div >
                <div className='flex flex-col gap-4'>
                    <div>
                        <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`} alt={pin?.title}
                            className="object-cover m-auto w-80 h-80 rounded-2xl" />
                    </div>
                    {isOwner &&
                        <div className='flex flex-col mx-4'>
                            <div className='mt-4'>
                                <p className='text-lg font-semibold'>Title</p>
                                <Input variant='unstyled' placeholder='Add' defaultValue={pinTitle} size={'lg'}
                                    onChange={(e) => setPinTitle(e.target.value)} />
                            </div>

                            <div className='mt-4'>
                                <p className='text-lg font-semibold'>Description</p>
                                <Input variant='unstyled' placeholder='Add what your board is about' size={'lg'}
                                    defaultValue={pinDescription} onChange={(e) => setPinDescripton(e.target.value)} />
                            </div>
                        </div>
                    }

                    <div className='flex flex-col mx-4 mb-[-0.5rem]'>
                        <p className='text-sm font-semibold'>Board</p>
                    </div>
                    <div className='flex items-center mx-4 border-white' onClick={() => setBoardSlideOpen(true)}>
                        {board ? (
                            <>
                                {board.boardCoverHash != '' ? (
                                    <img className='w-12 h-12 rounded-xl'
                                        src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.boardCoverHash}`} alt='board' />
                                ) : (
                                    <>
                                        {board.pins?.length > 0 && board.pins[0].imageHash ? (
                                            <img className='w-12 h-12 rounded-xl'
                                                src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`} alt='board' />
                                        ) : (
                                            <div className='w-12 h-12 bg-gray-200 rounded-xl'></div>

                                        )}
                                    </>
                                )}
                                <h2 className='ml-4 text-lg font-bold'>{board.name}</h2>
                                <IoChevronForward size={30} className='absolute right-5' />

                            </>


                        ) : (
                            <>
                                <div className='w-12 h-12 bg-gray-200 rounded-xl'></div>
                                <h2 className='ml-4 text-lg font-bold'>Choose Board</h2>
                                <IoChevronForward size={30} className='absolute right-5' />
                            </>
                        )}

                    </div>

                    <div className='flex mt-6 ml-4' onClick={() => setDeletePinModalOpen(true)}>
                        <p className='text-lg font-bold'>Delete this Pin</p>
                    </div>

                </div>

                <Slide direction='right' in={boardSlideOpen} style={{ zIndex: 20 }}>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-10 h-full">
                        <div className="flex items-center justify-between gap-24 flex-cols">
                            <button className="text-white" onClick={() => setBoardSlideOpen(false)}>
                                <IoChevronBack size={30} />
                            </button>
                        </div>
                        <div className="flex items-center gap-24 mt-4">
                            <h2 className="text-base text-white">Your Boards</h2>
                        </div>
                        <List>
                            {allBoards.map((board: any) => (
                                <ListItem key={Number(board.id)} onClick={() => handleNewBoard(board)}
                                >
                                    <div className='flex items-center h-16'>

                                        {board.boardCoverHash != '' ? (
                                            <img className='w-14 h-14 rounded-xl' src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.boardCoverHash}`} alt='board' />
                                        ) : (
                                            <>
                                                {board.pins?.length > 0 && board.pins[0].imageHash ? (
                                                    <img className='w-14 h-14 rounded-xl' src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`} alt='board' />
                                                ) : (
                                                    <div className='bg-gray-200 w-14 h-14 rounded-xl'></div>
                                                )}
                                            </>
                                        )}





                                        <div className='justify-center ml-4'>
                                            <h2 className='text-lg font-bold'>{board.name}</h2>
                                        </div>

                                        {newPinBoardId && newPinBoardId === Number(board.id) || !newPinBoardId && Number(board.id) === pinBoardId ? <IoCheckmarkSharp size={30} className='absolute right-6' /> : ''}
                                    </div>
                                </ListItem>
                            ))}
                        </List>
                    </div>
                </Slide>
            </Modal>
            <DeleteModal isOpen={deletePinModalOpen} closeModal={() => setDeletePinModalOpen(false)} isBoard={false} pin={pin} isOwner={isOwner} savedPinBoardId={pinBoardId} />
        </>
    );
};

export default EditBoardModal;

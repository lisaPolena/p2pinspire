import React, { useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, List, ListItem, Slide, Textarea, useToast } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react'
import pinManager from '../../contracts/build/PinManager.json';
import { useAccount, useContractWrite } from 'wagmi';
import { useIpfs } from '@/common/functions/contracts';
import ImageUploader from '../general/ImageUploader';
import { IoChevronBack, IoCheckmarkSharp } from "react-icons/io5";
import { getBoardsFromStorage } from '@/common/functions/boards';
import { Toast } from '../general/Toasts';


interface CreatePinModalProps {
    boardId?: number | null;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({ boardId }) => {
    const { address, isConnected } = useAccount()
    const [pinTitle, setPinTitle] = useState<string>('');
    const [pinDescription, setPinDescription] = useState<string>('');
    const [pinBoardId, setPinBoardId] = useState<number>(0);
    const [pinImage, setPinImage] = useState<string>('');
    const { allBoards, setAllBoards, createPinModalOpen, setCreatePinModalOpen, createdPin, setCreatedPin } = useAppState();
    const ipfs = useIpfs();
    const toast = useToast()
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [boardSlideOpen, setBoardSlideOpen] = useState<boolean>(false);

    const {
        data: createPinData,
        status: createPinStatus,
        writeAsync: createPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'createPin',
        onError(err) {
            console.log('error ', err);
        }
    });

    useEffect(() => {
        if (allBoards.length === 0) {
            const storageBoards = getBoardsFromStorage();
            setAllBoards(storageBoards);
        }
    }, [])

    const handleCreatePin = async () => {
        const bId = boardId ? boardId : pinBoardId;
        if (!pinTitle || (pinDescription && pinDescription.length > 50) || !pinImage || !bId) {
            if (!pinTitle) {
                handleToast('Title is empty!', '');
                return;
            }
            if (!pinImage) {
                handleToast('Image is empty!', '');
                return;
            }
            if (pinDescription && pinDescription.length > 50) {
                handleToast('Description is longer than 50 Characters!', '');
                return;
            }
            if (!bId) {
                handleToast('No Board selected!', '');
                return;
            }
            return;
        }
        await createPin({ args: [pinTitle, pinDescription, pinImage, bId] })
        setCreatePinModalOpen(false);
        setBoardSlideOpen(false);
        const board = allBoards.find((board) => board.id === Number(bId))
        if (board) setCreatedPin({ boardName: board.name, imageHash: pinImage });
        clearForm();
        handleLoadingCreatingPinToast('The Pin is being created...');
    }

    function clearForm() {
        setPinTitle('');
        setPinDescription('');
        setPinBoardId(0);
        setPinImage('');
    }


    function handleLoadingCreatingPinToast(message: string) {
        toast({
            position: 'top',
            render: () => (
                <Toast text={message} />
            ),
        })
    }

    const handleImageUpload = async (image: File | null) => {
        if (!image) return;
        setImageLoading(true);
        const res = await ipfs.add(image);
        setImageLoading(false);
        setPinImage(res.path);
    }

    const handleClose = () => {
        setCreatePinModalOpen(false);
        setBoardSlideOpen(false);
        clearForm();
    }

    function handleToast(message: string, imageHash: string) {
        toast({
            position: 'top',
            render: () => (
                <Toast text={message} imageHash={imageHash} />
            ),
        })
    }

    return (
        <>
            <Modal isOpen={createPinModalOpen} closeModal={() => handleClose()} title="Add new Pin" height='h-[95%]'>
                <div className='absolute top-3 right-3'>
                    {boardId ? (
                        <button
                            className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                            onClick={handleCreatePin}
                        >
                            Create
                        </button>
                    ) : (
                        <button
                            className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                            onClick={() => setBoardSlideOpen(true)}
                        >
                            Next
                        </button>

                    )}

                </div>
                <div className='flex flex-col gap-4'>
                    {!pinImage ? (
                        <ImageUploader handleUpload={handleImageUpload} isLoading={imageLoading} />
                    ) : (

                        <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pinImage}`}
                            className="object-cover m-auto w-80 h-80 rounded-2xl" />
                    )}

                    <div className='flex flex-col mx-4'>

                        <div className='mt-4'>
                            <p className='text-lg font-semibold'>Title</p>
                            <Input variant='unstyled' placeholder='Give your Pin a Title' size={'lg'}
                                defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                        </div>

                        <div className='mt-6'>
                            <p className='text-lg font-semibold'>Description</p>
                            <Textarea
                                variant='unstyled' placeholder='Say more about this Pin' size={'lg'}
                                defaultValue={pinDescription}
                                onChange={(e) => setPinDescription(e.target.value)}
                            />
                        </div>
                    </div>
                </div>
                {!boardId &&
                    <Slide direction='right' in={boardSlideOpen} style={{ zIndex: 20 }}>
                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-10 h-full">
                            <div className="flex items-center justify-between gap-24 flex-cols">
                                <button className="text-white" onClick={() => setBoardSlideOpen(false)}>
                                    <IoChevronBack size={30} />
                                </button>
                                <button
                                    className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                                    onClick={handleCreatePin}
                                >
                                    Create
                                </button>
                            </div>
                            <div className="flex items-center gap-24 mt-4">
                                <h2 className="text-base text-white">Your Boards</h2>
                            </div>
                            <List>
                                {allBoards.map((board: any) => (
                                    <ListItem key={Number(board.id)} onClick={() => setPinBoardId(Number(board.id))}>
                                        <div className='flex items-center h-16'>

                                            {board.boardCoverHash != '' ? (
                                                <img className='w-14 h-14 rounded-xl'
                                                    src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.boardCoverHash}`} alt='board' />
                                            ) : (
                                                <>
                                                    {board.pins?.length > 0 && board.pins[0].imageHash ? (
                                                        <img className='w-14 h-14 rounded-xl'
                                                            src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`} alt='board' />
                                                    ) : (
                                                        <div className='bg-gray-200 w-14 h-14 rounded-xl'></div>

                                                    )}
                                                </>
                                            )}

                                            <div className='justify-center ml-4'>
                                                <h2 className='text-lg font-bold'>{board.name}</h2>
                                            </div>

                                            {board.id === pinBoardId && <IoCheckmarkSharp size={30} className='absolute right-6' />}
                                        </div>
                                    </ListItem>
                                ))}
                            </List>
                        </div>
                    </Slide>
                }
            </Modal>
        </>
    );
};

export default CreatePinModal;

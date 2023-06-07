import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Box, Button, Input, List, ListItem, Select, Slide, Textarea, useToast } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react'
import boardManager from '../../contracts/build/BoardManager.json';
import pinManager from '../../contracts/build/PinManager.json';
import { useAccount, useContractEvent, useContractRead, useContractWrite } from 'wagmi';
import { Board } from '@/common/types/structs';
import { useIpfs } from '@/common/functions/contracts';
import ImageUploader from '../general/ImageUploader';
import SavePinModal from './SavePinModal';
import { IoChevronBack, IoCheckmarkSharp } from "react-icons/io5";


interface CreatePinModalProps {
    boardId?: number | null;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({ boardId }) => {
    const { address, isConnected } = useAccount()
    const [pinTitle, setPinTitle] = useState<string>('');
    const [pinDescription, setPinDescription] = useState<string>('');
    const [pinBoardId, setPinBoardId] = useState<number>(0);
    const [pinImage, setPinImage] = useState<string>('');
    const { createPinModalOpen, setCreatePinModalOpen, createdPin, setCreatedPin } = useAppState();
    const [boards, setBoards] = useState<any[]>([]);
    const ipfs = useIpfs();
    const toast = useToast()
    const [imageLoading, setImageLoading] = useState<boolean>(false);
    const [boardSlideOpen, setBoardSlideOpen] = useState<boolean>(false);

    const { data: allBoardsByAddress } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardsByOwner',
        args: [address],
        onSuccess(data) {
            const res = data as Board[];
            setBoards(res.map((board) => ({ id: Number(board.id), name: board.name, owner: board.owner, pins: board.pins })));
        },
    });

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
    })

    const unwatchPinCreated = useContractEvent({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        eventName: 'PinCreated',
        listener(log) {
            handleSavedPinToast();
        },
    });

    const handleCreatePin = async () => {
        if (!pinTitle || (pinDescription && pinDescription.length > 50) || !pinImage) {
            console.log('error');
            return;
        }
        const bId = boardId ? boardId : pinBoardId;
        await createPin({ args: [pinTitle, pinDescription, pinImage, bId] })
        setCreatePinModalOpen(false);
        const board = boards.find((board) => board.id === Number(bId))
        setCreatedPin({ boardName: board.name, imageHash: pinImage });
        clearForm();
        handleLoadingCreatingPinToast();
    }

    function clearForm() {
        setPinTitle('');
        setPinDescription('');
        setPinBoardId(0);
        setPinImage('');
    }

    //TODO; fix this, createdPin ist immmer ein hinter her, mit AppState probieren oder so --> funktioniert nicht
    function handleSavedPinToast() {
        if (!createdPin) return;
        toast({
            position: 'top',
            render: () => (
                <div className='text-white bg-zinc-800 rounded-full h-[70px] flex items-center justify-evenly gap-2 px-2' >
                    <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${createdPin.imageHash}`}
                        className="object-cover w-[50px] h-[50px] rounded-2xl" />
                    <p>Saved Pin to <strong>{createdPin.boardName}</strong></p>
                </div>
            ),
        })
    }

    function handleLoadingCreatingPinToast() {
        toast({
            position: 'top',
            render: () => (
                <div className='text-white bg-zinc-800 rounded-full h-[70px] flex flex-col items-center justify-center' >
                    <p>The Pin is being created...</p>
                    <Progress size='xs' isIndeterminate />
                </div>
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

    return (
        <>
            <Modal isOpen={createPinModalOpen} closeModal={() => handleClose()} title="Add new Pin" height='h-[95%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                        onClick={() => setBoardSlideOpen(true)}
                    >
                        Next
                    </button>
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
                            {boards.map((board: any) => (
                                <ListItem key={Number(board.id)} onClick={() => setPinBoardId(Number(board.id))}>
                                    <div className='flex items-center h-16'>

                                        {board.pins?.length > 0 && board.pins[0].imageHash ? (
                                            <img className='w-14 h-14 rounded-xl' src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`} alt='board' />
                                        ) : (
                                            <div className='bg-gray-200 w-14 h-14 rounded-xl'></div>
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
            </Modal>
        </>
    );
};

export default CreatePinModal;

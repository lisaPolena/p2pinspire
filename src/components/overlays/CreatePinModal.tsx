import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Select, useToast } from '@chakra-ui/react';
import { Progress } from '@chakra-ui/react'
import boardManager from '../../contracts/build/BoardManager.json';
import pinManager from '../../contracts/build/PinManager.json';
import { useAccount, useContractEvent, useContractRead, useContractWrite } from 'wagmi';
import { Board } from '@/common/types/structs';
import { useIpfs } from '@/common/functions/contracts';
import ImageUploader from '../general/ImageUploader';

interface CreatePinModalProps {
    boardId?: number | null;
}

const CreatePinModal: React.FC<CreatePinModalProps> = ({ boardId }) => {
    const { address, isConnected } = useAccount()
    const [pinTitle, setPinTitle] = useState<string>('');
    const [pinDescription, setPinDescription] = useState<string>('');
    const [pinBoardId, setPinBoardId] = useState<string>('');
    const [pinImage, setPinImage] = useState<string>('');
    const { createPinModalOpen, setCreatePinModalOpen, createdPin, setCreatedPin } = useAppState();
    const [boards, setBoards] = useState<any[]>([]);
    const ipfs = useIpfs();
    const toast = useToast()
    const [imageLoading, setImageLoading] = useState<boolean>(false);

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
        setPinBoardId('');
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
        clearForm();
    }

    return (
        <Modal isOpen={createPinModalOpen} closeModal={handleClose} title="Add new Pin" height='h-[95%]'>
            <div className='absolute top-3 right-3'>
                <button
                    className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                    onClick={() => handleCreatePin()}
                >
                    Create
                </button>
            </div>
            <div className='flex flex-col gap-4'>
                {!pinImage ? (
                    <ImageUploader handleUpload={handleImageUpload} isLoading={imageLoading} />
                ) : (

                    <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pinImage}`}
                        className="object-cover m-auto w-80 h-80 rounded-2xl" />
                )}

                <div>
                    <p>Title</p>
                    <Input variant='unstyled' placeholder='Give your Pin a title' defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                </div>

                <div>
                    <p>Description</p>
                    <Input variant='unstyled' placeholder='Say more about this Pin' defaultValue={pinDescription} onChange={(e) => setPinDescription(e.target.value)} />
                </div>

                {!boardId &&
                    <div>
                        <Select placeholder='Select option' onChange={(e) => setPinBoardId(e.target.value)}>
                            {boards.map((board) => <option key={Number(board.id)} value={Number(board.id)}>{board.name}</option>)}
                        </Select>
                    </div>
                }
            </div>
        </Modal>
    );
};

export default CreatePinModal;

import React from 'react';
import { useAppState } from '../../general/AppStateContext';
import OutsideAlerter from '../../general/OutsideClickAlerter';
import { Button, useToast } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import boardManager from '../../../contracts/build/BoardManager.json';
import pinManager from '../../../contracts/build/PinManager.json';
import { useContractWrite } from 'wagmi';
import { Toast } from '../../general/Toasts';
import { Board, Pin } from '@/common/types/structs';

interface DeleteModalProps {
    isOpen: boolean;
    isBoard: boolean;
    closeModal: () => void;
    board?: Board | null;
    pin?: Pin | null;
    isOwner?: boolean;
    savedPinBoardId?: string | number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, isBoard, closeModal, board, pin, isOwner, savedPinBoardId }) => {
    const { setDeleteModalOpen, setEditBoardModalOpen, setLoadDeleteBoardTransaction, setDeletePinModalOpen, setEditPinModalOpen } = useAppState();
    const router = useRouter();
    const toast = useToast();

    const {
        data: deleteCreatedPinData,
        status: deleteCreatedPinStatus,
        writeAsync: deleteCreatedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'deletePin',
        onError(err) {
            console.log('error ', err);
        }
    })

    const {
        data: deleteSavedPinData,
        status: deleteSavedPinStatus,
        writeAsync: deleteSavedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'deleteSavedPin',
        onError(err) {
            console.log('error ', err);
        }
    })

    const {
        data: deleteBoardData,
        status: deleteBoardStatus,
        writeAsync: deleteBoard,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'deleteBoard',
        onError(err) {
            console.log('error ', err);
        }
    })

    const handleDeleteBoard = async () => {
        if (board) {
            setDeleteModalOpen(false);
            setEditBoardModalOpen(false);
            await deleteBoard({ args: [board.id] })
            setLoadDeleteBoardTransaction(Number(board.id));
            handleToast('Board deleting...', '');
            router.push('/profile');
        } else {
            //TODO: handle error
            console.log('no board to delete');
        }
    }

    const deletePin = async () => {
        if (pin && isOwner) {
            setDeletePinModalOpen(false);
            setEditPinModalOpen(false);
            await deleteCreatedPin({ args: [pin.id] })
            handleToast('Pin deleting...', '');
            router.back();
        } else if (pin && !isOwner) {
            setDeletePinModalOpen(false);
            setEditPinModalOpen(false);
            await deleteSavedPin({ args: [pin.id, savedPinBoardId] })
            router.back();
        } else {
            //TODO: handle error
            console.log('no pin to delete');
        }
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
            {isOpen &&
                <OutsideAlerter action={closeModal}>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[14] h-[20%]">
                        <div>
                            <h2 className="text-xl text-white">{isBoard ? 'Delete this board and all of its Pins?' : 'Are you sure?'}</h2>
                        </div>
                        <div className='flex justify-evenly'>
                            <Button colorScheme="secondary" borderRadius={'50px'} variant='solid' onClick={closeModal}>Cancel</Button>
                            <Button colorScheme="primary" borderRadius={'50px'} variant='solid' onClick={isBoard ? () => handleDeleteBoard() : () => deletePin()}>{isBoard ? 'Delete forever' : 'Delete'}</Button>
                        </div>
                    </div>
                </OutsideAlerter>
            }
        </>

    );
};

export default DeleteModal;

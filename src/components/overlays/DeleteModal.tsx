import React from 'react';
import { useAppState } from '../general/AppStateContext';
import OutsideAlerter from '../general/OutsideClickAlerter';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useBoardManager, usePinManager } from '@/common/functions/contracts';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'

interface DeleteModalProps {
    isOpen: boolean;
    isBoard: boolean;
    closeModal: () => void;
    board?: any;
    pin?: any;
    isOwner?: boolean;
    savedPinBoardId?: string | number;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, isBoard, closeModal, board, pin, isOwner, savedPinBoardId }) => {
    const { setDeleteModalOpen, setEditBoardModalOpen, setLoadDeleteBoardTransaction, setDeletePinModalOpen, setEditPinModalOpen } = useAppState();
    const { library } = useWeb3React<Web3Provider>()
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const router = useRouter();

    const deleteBoard = () => {
        if (board) {
            boardManagerContract?.deleteBoard(board.id);
            setLoadDeleteBoardTransaction(board.id.toNumber());
            setDeleteModalOpen(false);
            setEditBoardModalOpen(false);
            router.push('/profile');
        } else {
            //TODO: handle error
            console.log('no board to delete');
        }
    }

    const deletePin = () => {
        if (pin && isOwner) {
            pinManagerContract?.deletePin(pin.id);
            setDeletePinModalOpen(false);
            setEditPinModalOpen(false);
            router.back();
        } else if (pin && !isOwner) {
            boardManagerContract?.deleteSavedPin(pin.id as string, savedPinBoardId);
            setDeletePinModalOpen(false);
            setEditPinModalOpen(false);
            router.back();
        } else {
            //TODO: handle error
            console.log('no pin to delete');
        }
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
                            <Button colorScheme="primary" borderRadius={'50px'} variant='solid' onClick={isBoard ? deleteBoard : deletePin}>{isBoard ? 'Delete forever' : 'Delete'}</Button>
                        </div>
                    </div>
                </OutsideAlerter>
            }
        </>

    );
};

export default DeleteModal;

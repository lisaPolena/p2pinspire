import React from 'react';
import { useAppState } from '../general/AppStateContext';
import OutsideAlerter from '../general/OutsideClickAlerter';
import { Button } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useBoardManager } from '@/common/functions/contracts';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'

interface DeleteModalProps {
    isOpen: boolean;
    closeModal: () => void;
    board?: any;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, closeModal, board }) => {
    const { setDeleteModalOpen, setEditBoardModalOpen } = useAppState();
    const { library } = useWeb3React<Web3Provider>()
    const boardManagerContract = useBoardManager(library);
    const router = useRouter();

    //TODO: add transition to modal opening and closing

    const deleteBoard = () => {
        if (board) {
            boardManagerContract?.deleteBoard(board.id);
            setDeleteModalOpen(false);
            setEditBoardModalOpen(false);
            router.push('/profile');
        } else {
            console.log('no board to delete');
        }
    }

    return (
        <>
            {isOpen &&
                <OutsideAlerter action={closeModal}>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[14] h-[20%]">
                        <div>
                            <h2 className="text-xl text-white">Delete this board and all of its Pins?</h2>
                        </div>
                        <div className='flex justify-evenly'>
                            <Button colorScheme="secondary" borderRadius={'50px'} variant='solid' onClick={closeModal}>Cancel</Button>
                            <Button colorScheme="primary" borderRadius={'50px'} variant='solid' onClick={deleteBoard}>Delete forever</Button>
                        </div>
                    </div>
                </OutsideAlerter>
            }
        </>

    );
};

export default DeleteModal;

import React from 'react';
import OutsideAlerter from '../../general/OutsideClickAlerter';
import { Button } from '@chakra-ui/react';

interface DeleteProfileModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleDeleteProfile: () => void;
}

const DeleteProfileModal: React.FC<DeleteProfileModalProps> = ({ isOpen, closeModal, handleDeleteProfile }) => {

    return (
        <>
            {isOpen &&
                <OutsideAlerter action={closeModal}>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[14] h-[20%]">
                        <div>
                            <h2 className="text-xl text-white">Are you sure?</h2>
                        </div>
                        <div className='flex justify-evenly'>
                            <Button colorScheme="secondary" borderRadius={'50px'} variant='solid' onClick={closeModal}>Cancel</Button>
                            <Button colorScheme="primary" borderRadius={'50px'} variant='solid' onClick={handleDeleteProfile}>Delete</Button>
                        </div>
                    </div>
                </OutsideAlerter>
            }
        </>

    );
};

export default DeleteProfileModal;

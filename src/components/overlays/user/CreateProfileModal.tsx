import React from 'react';
import OutsideAlerter from '../../general/OutsideClickAlerter';
import { Button } from '@chakra-ui/react';

interface CreateProfileModalProps {
    isOpen: boolean;
    closeModal: () => void;
    handleCreateUser: () => void;
}

const CreateProfileModal: React.FC<CreateProfileModalProps> = ({ isOpen, closeModal, handleCreateUser }) => {

    return (
        <>
            {isOpen &&
                <OutsideAlerter action={closeModal}>
                    <div className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-[14] h-[20%]">
                        <div>
                            <h2 className="text-xl text-white">You need an account:</h2>
                        </div>
                        <div className='flex justify-evenly'>
                            <Button colorScheme="secondary" borderRadius={'50px'} variant='solid' onClick={closeModal}>Cancel</Button>
                            <Button colorScheme="primary" borderRadius={'50px'} variant='solid' onClick={handleCreateUser}>Create</Button>
                        </div>
                    </div>
                </OutsideAlerter>
            }
        </>

    );
};

export default CreateProfileModal;

import React from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { List, ListItem } from '@chakra-ui/react';

const AddModal: React.FC = () => {
    const { addModalOpen, setAddModalOpen, setCreatePinModalOpen } = useAppState();

    return (
        <Modal isOpen={addModalOpen} isAlternative={true} closeModal={() => setAddModalOpen(false)} title={"Create"} height='h-[50%]'>
            <List>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Idea Pin</p>
                </ListItem>
                <ListItem onClick={() => setCreatePinModalOpen(true)}>
                    <p className='mb-4 text-lg font-bold'>Pin</p>
                </ListItem>

                <h2 className='mt-10 mb-4 text-sm text-white'>Add</h2>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Section</p>
                </ListItem>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Collaborator</p>
                </ListItem>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Note</p>
                </ListItem>
            </List>
        </Modal>
    );
};

export default AddModal;

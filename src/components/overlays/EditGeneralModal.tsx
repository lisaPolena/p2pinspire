import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { List, ListItem } from '@chakra-ui/react';

interface EditGeneralModalProps {
}

const EditGeneralModal: React.FC<EditGeneralModalProps> = () => {

    const { editModalOpen, setEditModalOpen } = useAppState();
    const { setEditBoardModalOpen } = useAppState();

    //TODO: add transition to modal opening and closing

    return (
        <Modal isOpen={editModalOpen} isAlternative={true} closeModal={() => setEditModalOpen(false)} title="Board Options" height='h-[38%]'>
            <List>
                <ListItem onClick={() => setEditBoardModalOpen(true)}>
                    <p className='mb-4 text-lg font-bold'>Edit Board</p>
                </ListItem>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Merge</p>
                </ListItem>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Share</p>
                </ListItem>
                <ListItem>
                    <p className='mb-4 text-lg font-bold'>Archive</p>
                </ListItem>
            </List>
        </Modal>
    );
};

export default EditGeneralModal;

import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { List, ListItem } from '@chakra-ui/react';


const EditGeneralModal: React.FC = () => {
    const { editModalOpen, setEditModalOpen } = useAppState();
    const { setEditBoardModalOpen } = useAppState();

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

import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { List, ListItem } from '@chakra-ui/react';

interface EditGeneralModalProps {
    isBoard: boolean;
    isSavedPin: boolean;
}


const EditGeneralModal: React.FC<EditGeneralModalProps> = (props: EditGeneralModalProps) => {
    const { isBoard, isSavedPin } = props;
    const { editModalOpen, setEditModalOpen } = useAppState();
    const { setEditBoardModalOpen, setEditPinModalOpen, setDownloadPin } = useAppState();

    function handleClickEdit() {
        if (isBoard) {
            setEditBoardModalOpen(true);
        } else if (isSavedPin) {
            setEditPinModalOpen(true);
        }
    }

    function handleMergeDownloadClick() {
        if (isBoard) {
            console.log('merge');
        } else if (isSavedPin) {
            setDownloadPin(true);
            setEditModalOpen(false);
        }
    }

    return (
        <Modal isOpen={editModalOpen} isAlternative={true} closeModal={() => setEditModalOpen(false)} title={isBoard ? "Board Options" : 'More Options'} height='h-[38%]'>
            <List>
                {isBoard || isSavedPin ? (
                    <>
                        <ListItem onClick={handleClickEdit}>
                            <p className='mb-4 text-lg font-bold'>{isBoard ? 'Edit Board' : 'Edit Pin'}</p>
                        </ListItem>
                        <ListItem onClick={handleMergeDownloadClick}>
                            <p className='mb-4 text-lg font-bold'>{isBoard ? 'Merge' : 'Download Image'}</p>
                        </ListItem>
                        <ListItem>
                            <p className='mb-4 text-lg font-bold'>{isBoard ? 'Share' : 'Copy Link'}</p>
                        </ListItem>
                        {isBoard &&
                            <ListItem>
                                <p className='mb-4 text-lg font-bold'>Archive</p>
                            </ListItem>
                        }
                    </>

                ) : (
                    <>
                    </>
                )}
            </List>
        </Modal>
    );
};

export default EditGeneralModal;

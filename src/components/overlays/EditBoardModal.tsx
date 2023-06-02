import React from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Switch } from '@chakra-ui/react';
import DeleteModal from './DeleteModal';

interface EditGeneralModalProps {
}


const EditBoardModal: React.FC<EditGeneralModalProps> = (props: EditGeneralModalProps) => {
    const { editBoardModalOpen, setEditBoardModalOpen, deleteModalOpen, setDeleteModalOpen } = useAppState();
    const [boardName, setBoardName] = React.useState<string>('');
    const [boardDescription, setBoardDescripton] = React.useState<string>('');

    return (
        <>
            {deleteModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editBoardModalOpen} closeModal={() => setEditBoardModalOpen(false)} title="Edit Board" height='h-[99%]'>
                <div className='flex flex-col gap-4'>
                    <div>
                        <p>Board cover</p>
                    </div>
                    <div>
                        <p>Board name</p>
                        <Input variant='unstyled' placeholder='Add' defaultValue={boardName} onChange={(e) => setBoardName(e.target.value)} />
                    </div>

                    <div>
                        <p>Description</p>
                        <Input variant='unstyled' placeholder='Add what your board is about' defaultValue={boardDescription} onChange={(e) => setBoardDescripton(e.target.value)} />
                    </div>

                    <div>
                        <p>Collaborators</p>
                        <Input variant='unstyled' placeholder='Collaborators' />
                    </div>

                    <div>
                        <p>Settings</p>
                        <div className='flex flex-col justify-between item-center'>
                            <div className='flex flex-row'>
                                <div>
                                    <p className='font-bold'>Make this board secret</p>
                                    <p className='text-gray-400 text-s'>Only you and collaborators will see this board</p>
                                </div>
                                <div className='mt-1'><Switch size='md' /></div>
                            </div>
                            <div className='flex flex-row'>
                                <div>
                                    <p className='font-bold'>Personalisation</p>
                                    <p className='text-gray-400 text-s'>Show Pins inspired by this board in your home feed</p>
                                </div>
                                <div className='mt-1'><Switch size='md' /></div>
                            </div>

                        </div>
                    </div>

                    <div>
                        <p>Actions</p>
                        <div className='flex justify-between item-center' onClick={() => setDeleteModalOpen(true)}>
                            <div>
                                <p className='font-bold'>Delete Board</p>
                                <p className='text-gray-400 text-s'>Delete this board and all of its Pins forever. You can't undo this.</p>
                            </div>
                        </div>
                    </div>

                </div>
            </Modal>
            <DeleteModal isOpen={deleteModalOpen} closeModal={() => setDeleteModalOpen(false)} />
        </>
    );
};

export default EditBoardModal;

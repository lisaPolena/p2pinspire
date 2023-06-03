import React, { useEffect } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Switch } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'

interface EditPinModalProps {
    pin: any;
}

const EditBoardModal: React.FC<EditPinModalProps> = (props: EditPinModalProps) => {
    const { pin } = props;
    const { editPinModalOpen, setEditPinModalOpen, deleteModalOpen, setDeleteModalOpen } = useAppState();
    const [pinTitle, setPinTitle] = React.useState<string>('');
    const [pinDescription, setPinDescripton] = React.useState<string>('');
    const { library } = useWeb3React<Web3Provider>();

    useEffect(() => {

        if (pin) {
            setPinTitle(pin.title);
            setPinDescripton(pin.description);
        }

    }, [pin ? pin.title : '', pin ? pin.description : '']);

    return (
        <>
            {deleteModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editPinModalOpen} closeModal={() => setEditPinModalOpen(false)} title="Edit Pin" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={pinTitle?.length === 0}
                        onClick={() => console.log('done')}
                    >
                        Done
                    </button>
                </div >
                <div className='flex flex-col gap-4'>
                    <div>
                        <p>Board cover</p>
                    </div>
                    <div>
                        <p>Board name</p>
                        <Input variant='unstyled' placeholder='Add' defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                    </div>

                    <div>
                        <p>Description</p>
                        <Input variant='unstyled' placeholder='Add what your board is about' defaultValue={pinDescription} onChange={(e) => setPinDescripton(e.target.value)} />
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
        </>
    );
};

export default EditBoardModal;

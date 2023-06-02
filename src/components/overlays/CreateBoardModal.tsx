import React, { useEffect } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Switch } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager } from '@/common/functions/contracts';

const CreateBoardModal: React.FC = () => {
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    const { library } = useWeb3React<Web3Provider>();
    const { createBoardModalOpen, setCreateBoardModalOpen } = useAppState();
    const { setLoadCreateBoardTransaction } = useAppState();
    const [boardName, setBoardName] = React.useState('');
    const boardManagerContract = useBoardManager(library);

    useEffect(() => {
        setBoardName('');
    }, [createBoardModalOpen])

    async function createBoard() {
        const tx = await boardManagerContract?.createBoard(boardName);
        setCreateBoardModalOpen(false);
        setLoadCreateBoardTransaction(true);
        await tx.wait()
        setLoadCreateBoardTransaction(false);
    }

    return (
        <Modal isOpen={createBoardModalOpen} closeModal={() => setCreateBoardModalOpen(false)} title="Add new Board" height='h-[95%]'>
            <div className='absolute top-3 right-3'>
                <button
                    className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                    disabled={boardName?.length === 0}
                    onClick={createBoard}
                >
                    Create
                </button>
            </div >

            <div className='flex flex-col gap-4'>
                <div>
                    <p>Board name</p>
                    <Input variant='unstyled' placeholder='Add' defaultValue={boardName} onChange={(e) => setBoardName(e.target.value)} />
                </div>


                <div>
                    <p>Collaborators</p>
                    <Input variant='unstyled' placeholder='Collaborators' />
                </div>

                <div>
                    <p>Privacy</p>
                    <div className='flex justify-between item-center'>
                        <div>
                            <p className='font-bold'>Make this board secret</p>
                            <p className='text-gray-400 text-s'>Only you and collaborators will see this board</p>
                        </div>
                        <div className='mt-1'><Switch size='md' /></div>
                    </div>
                </div>

            </div>
        </Modal >
    );
};

export default CreateBoardModal;

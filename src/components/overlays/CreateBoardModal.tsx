import React, { useEffect } from 'react';
import { BsFillPinFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Button, Input, Switch } from '@chakra-ui/react';
//import { boardManagerContract } from '@/common/functions/contracts';
import { useWeb3React } from '@web3-react/core';
import { Contract, ethers } from 'ethers';
import boardManager from '../../contracts/build/BoardManager.json';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager } from '@/common/functions/contracts';

interface CreateBoardModalProps {
}

declare var window: any;

const CreateBoardModal: React.FC<CreateBoardModalProps> = () => {

    const { createBoardModalOpen, setCreateBoardModalOpen } = useAppState();
    const { setLoadCreateBoardTransaction } = useAppState();
    const [boardName, setBoardName] = React.useState('');
    const { active, account, library, deactivate } = useWeb3React<Web3Provider>();
    const boardManagerContract = useBoardManager(library);

    //TODO: add transition to modal opening and closing

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

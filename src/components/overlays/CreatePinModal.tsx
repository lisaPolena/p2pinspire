import React, { ChangeEvent, useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Select, useToast } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager, useIpfs, usePinManager } from '@/common/functions/contracts';
import { Progress } from '@chakra-ui/react'

const CreatePinModal: React.FC = () => {
    // account: returns the users account (or .eth name)
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    const { account, library } = useWeb3React<Web3Provider>();
    const [pinTitle, setPinTitle] = React.useState('');
    const [pinDescription, setPinDescription] = React.useState('');
    const [pinBoardId, setPinBoardId] = React.useState('');
    const [pinImage, setPinImage] = React.useState<any>(null);
    const { createPinModalOpen, setCreatePinModalOpen } = useAppState();
    const [boards, setBoards] = useState<any[]>([]);
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const ipfs = useIpfs();
    const toast = useToast()

    useEffect(() => {
        setPinTitle('');
        setPinDescription('');
        getAllBoards();

        if (pinCreatedEvent) pinManagerContract?.on(pinCreatedEvent, handlePinCreated);

        return () => {
            if (pinCreatedEvent) pinManagerContract?.off(pinCreatedEvent, handlePinCreated);
        }
    }, [library, account])

    function getAllBoards() {
        boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
            setBoards(result.map((board: any) => ({ id: board.id, name: board.name, owner: board.owner, pins: board.pins })));
        });
    }

    async function createPin() {
        const result = await ipfs.add(pinImage);
        const tx = await pinManagerContract?.createPin(pinTitle, pinDescription, result.path, pinBoardId);
        setCreatePinModalOpen(false);
        handleLoadingCreatingPinToast();
        await tx?.wait();
    }

    const pinCreatedEvent = pinManagerContract?.filters.PinCreated(null, null, null, null, null, account);

    const handlePinCreated = () => {
        handleSavedPinToast();
    };

    function handleSavedPinToast() {
        toast({
            position: 'top',
            render: () => (
                <div className='text-white bg-zinc-800 rounded-xl h-[70px] flex items-center justify-center' >
                    Saved Pin to
                </ div >
            ),
        })
    }

    function handleLoadingCreatingPinToast() {
        toast({
            position: 'top',
            render: () => (
                <div className='text-white bg-zinc-800 rounded-xl h-[70px] flex flex-col items-center justify-center' >
                    <p>Pin creating...</p>
                    <Progress size='xs' isIndeterminate />
                </div>
            ),
        })
    }

    return (
        <Modal isOpen={createPinModalOpen} closeModal={() => setCreatePinModalOpen(false)} title="Add new Pin" height='h-[95%]'>
            <div className='absolute top-3 right-3'>
                <button
                    className="px-4 py-2 text-white transition-colors bg-red-600 rounded-3xl"
                    onClick={() => createPin()}
                >
                    Create
                </button>
            </div>
            <div className='flex flex-col gap-4'>
                <input type="file" accept="image/*" onChange={(e: ChangeEvent<HTMLInputElement>) => setPinImage(e.target.files ? e.target.files[0] : null)} />
                <div>
                    <p>Title</p>
                    <Input variant='unstyled' placeholder='Give your Pin a title' defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                </div>

                <div>
                    <p>Description</p>
                    <Input variant='unstyled' placeholder='Say more about this Pin' defaultValue={pinDescription} onChange={(e) => setPinDescription(e.target.value)} />
                </div>

                <div>
                    <Select placeholder='Select option' onChange={(e) => setPinBoardId(e.target.value)}>
                        {boards.map((board) => <option key={board.id} value={board.id}>{board.name}</option>)}
                    </Select>
                </div>
            </div>
        </Modal>
    );
};

export default CreatePinModal;

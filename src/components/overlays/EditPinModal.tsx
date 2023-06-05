import React, { useEffect } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Select } from '@chakra-ui/react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager, usePinManager } from '@/common/functions/contracts';
import DeleteModal from './DeleteModal';
import { useRouter } from 'next/router';

interface EditPinModalProps {
    pin: any;
}

const EditBoardModal: React.FC<EditPinModalProps> = (props: EditPinModalProps) => {
    const { pin } = props;
    const { editPinModalOpen, setEditPinModalOpen, deletePinModalOpen, setDeletePinModalOpen } = useAppState();
    const [pinTitle, setPinTitle] = React.useState<string>('');
    const [pinDescription, setPinDescripton] = React.useState<string>('');
    const [pinBoardId, setPinBoardId] = React.useState<string>('');
    const [newPinBoardId, setNewPinBoardId] = React.useState<string>('');
    const { account, library } = useWeb3React<Web3Provider>();
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [boards, setBoards] = React.useState<any[]>([]);
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const router = useRouter();

    useEffect(() => {
        const { boardId } = router.query;

        getAllBoards();

        if (pin && pin.owner === account) {
            setIsOwner(true);
            setPinTitle(pin.title);
            setPinDescripton(pin.description);
            setPinBoardId(pin.boardId);
        } else {
            setIsOwner(false);
            setPinBoardId(boardId as string);
        }

        setNewPinBoardId('');


    }, [pin ? pin.title : '', pin ? pin.description : '', account]);

    function getAllBoards() {
        boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
            setBoards(result.map((board: any) => ({ id: board.id, name: board.name, owner: board.owner, pins: board.pins })));
        });
    }

    //TODO created edit pin event 
    async function editCreatedPin() {
        const tx = await pinManagerContract?.editCreatedPin(pin.id as string, pinTitle, pinDescription, newPinBoardId);
        setEditPinModalOpen(false);
        router.push('/profile');
        await tx.wait()
    }

    //TODO saved edit pin event 
    async function editSavedPin() {
        const tx = await boardManagerContract?.editSavedPin(pin.id as string, pinBoardId, newPinBoardId);
        setEditPinModalOpen(false);
        router.push('/profile');
        await tx.wait()
    }

    return (
        <>
            {deletePinModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editPinModalOpen} closeModal={() => setEditPinModalOpen(false)} title="Edit Pin" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={(isOwner && pinTitle?.length === 0) || (!isOwner && (newPinBoardId !== '' ? pinBoardId === newPinBoardId : newPinBoardId === ''))}
                        onClick={isOwner ? editCreatedPin : editSavedPin}
                    >
                        Done
                    </button>
                </div >
                <div className='flex flex-col gap-4'>
                    <div>
                        <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`} alt={pin?.title} className='object-cover w-40 h-40 rounded-2xl' />
                    </div>
                    {isOwner &&
                        <>
                            <div>
                                <p>Title</p>
                                <Input variant='unstyled' placeholder='Add' defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                            </div>

                            <div>
                                <p>Description</p>
                                <Input variant='unstyled' placeholder='Add what your board is about' defaultValue={pinDescription} onChange={(e) => setPinDescripton(e.target.value)} />
                            </div>
                        </>
                    }

                    <div>
                        <Select placeholder='Select option' onChange={(e) => setNewPinBoardId(e.target.value)}>
                            {boards.map((board) =>
                                <option key={board.id} value={board.id.toNumber()} selected={board.id.toNumber() == pinBoardId}>{board.name}</option>
                            )}
                        </Select>
                    </div>

                    <div className='flex justify-between item-center' onClick={() => setDeletePinModalOpen(true)}>
                        <div>
                            <p className='font-bold'>Delete this Pin</p>
                        </div>
                    </div>

                </div>
            </Modal>
            <DeleteModal isOpen={deletePinModalOpen} closeModal={() => setDeletePinModalOpen(false)} isBoard={false} pin={pin} isOwner={isOwner} savedPinBoardId={pinBoardId} />
        </>
    );
};

export default EditBoardModal;

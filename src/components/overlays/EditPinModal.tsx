import React, { useEffect } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Select, Switch } from '@chakra-ui/react';
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
    const { account, library } = useWeb3React<Web3Provider>();
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [boards, setBoards] = React.useState<any[]>([]);
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const router = useRouter();

    useEffect(() => {

        getAllBoards();

        if (pin) {
            setPinTitle(pin.title);
            setPinDescripton(pin.description);
            setPinBoardId(pin.boardId);
        }

        if (pin && pin.owner === account) {
            console.log('owner');
            setIsOwner(true);
        } else {
            setIsOwner(false);
        }

    }, [pin ? pin.title : '', pin ? pin.description : '']);

    function getAllBoards() {
        boardManagerContract?.getAllBoards().then((result: any) => {
            setBoards(result.map((board: any) => ({ id: board.id, name: board.name, owner: board.owner, pins: board.pins })));
        });
    }

    async function editPin() {
        const tx = await pinManagerContract?.editPin(pin.id as string, pinTitle, pinDescription, pinBoardId);
        setEditPinModalOpen(false);
        await tx.wait()
        router.push('/profile');
    }

    return (
        <>
            {deletePinModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editPinModalOpen} closeModal={() => setEditPinModalOpen(false)} title="Edit Pin" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={pinTitle?.length === 0}
                        onClick={editPin}
                    >
                        Done
                    </button>
                </div >
                <div className='flex flex-col gap-4'>
                    <div>
                        <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`} alt={pin.title} className='object-cover w-40 h-40 rounded-2xl' />
                    </div>
                    <div>
                        <p>Title</p>
                        <Input variant='unstyled' placeholder='Add' defaultValue={pinTitle} onChange={(e) => setPinTitle(e.target.value)} />
                    </div>

                    <div>
                        <p>Description</p>
                        <Input variant='unstyled' placeholder='Add what your board is about' defaultValue={pinDescription} onChange={(e) => setPinDescripton(e.target.value)} />
                    </div>

                    <div>
                        <Select placeholder='Select option' onChange={(e) => setPinBoardId(e.target.value)}>
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
            <DeleteModal isOpen={deletePinModalOpen} closeModal={() => setDeletePinModalOpen(false)} isBoard={false} pin={pin} />
        </>
    );
};

export default EditBoardModal;

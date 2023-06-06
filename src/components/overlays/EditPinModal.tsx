import React, { useEffect } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { Input, Select } from '@chakra-ui/react';
import DeleteModal from './DeleteModal';
import { useRouter } from 'next/router';
import boardManager from '../../contracts/build/BoardManager.json';
import pinManager from '../../contracts/build/PinManager.json';
import { useAccount, useContractRead, useContractWrite, usePrepareContractWrite } from 'wagmi';
import { Board } from '@/common/types/structs';

interface EditPinModalProps {
    pin: any;
}

const EditBoardModal: React.FC<EditPinModalProps> = (props: EditPinModalProps) => {
    const { pin } = props;
    const { address, isConnected } = useAccount()
    const { editPinModalOpen, setEditPinModalOpen, deletePinModalOpen, setDeletePinModalOpen } = useAppState();
    const [pinTitle, setPinTitle] = React.useState<string>('');
    const [pinDescription, setPinDescripton] = React.useState<string>('');
    const [pinBoardId, setPinBoardId] = React.useState<string | number>('');
    const [newPinBoardId, setNewPinBoardId] = React.useState<string>('');
    const [isOwner, setIsOwner] = React.useState<boolean>(false);
    const [boards, setBoards] = React.useState<Board[]>([]);
    const router = useRouter();

    const { data: allBoardsByAddress } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardsByOwner',
        args: [address],
        onSuccess(data) {
            setBoards(data as Board[]);
        },
    });

    const {
        data: savedPinData,
        status: editSavedPinStatus,
        writeAsync: writeEditSavedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'editSavedPin',
        onError(err) {
            console.log('err.prepare: ', err);
        }
    })

    const {
        data: createdPinData,
        status: editCreatedPinStatus,
        writeAsync: writeEditCreatedPin,
    } = useContractWrite({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'editCreatedPin',
        onError(err) {
            console.log('error ', err);
        }
    })

    useEffect(() => {
        const { boardId } = router.query;

        if (pin && pin.owner === address) {
            setIsOwner(true);
            setPinTitle(pin.title);
            setPinDescripton(pin.description);
            setPinBoardId(Number(pin.boardId));
        } else {
            setIsOwner(false);
            setPinBoardId(Number(boardId));
        }

        console.log('editSavedPinStatus: ', editSavedPinStatus);
        console.log('editCreatedPinStatus: ', editCreatedPinStatus);

    }, [pin, address, allBoardsByAddress, editSavedPinStatus, editCreatedPinStatus]);

    //TODO created edit pin event 
    async function editCreatedPin() {
        await writeEditCreatedPin({ args: [pin.id as string, pinTitle, pinDescription, newPinBoardId] })
        setEditPinModalOpen(false);
        setNewPinBoardId('');
        router.push('/profile');
    }

    //TODO saved edit pin event 
    const editSavedPin = async () => {
        await writeEditSavedPin({ args: [pin.id as string, pinBoardId, newPinBoardId] })
        setEditPinModalOpen(false);
        setNewPinBoardId('');
        router.push('/profile');
    }

    return (
        <>
            {deletePinModalOpen && <div className='absolute top-0 w-full h-full z-[12] bg-zinc-800 opacity-70'></div>}
            <Modal isOpen={editPinModalOpen} closeModal={() => setEditPinModalOpen(false)} title="Edit Pin" height='h-[99%]'>
                <div className='absolute top-3 right-3'>
                    <button
                        className="px-4 py-2 transition-colors text-white bg-red-600 disabled:!bg-transparent disabled:!text-gray-400 rounded-3xl"
                        disabled={(isOwner && pinTitle?.length === 0) || (!isOwner && (newPinBoardId !== '' ? pinBoardId === newPinBoardId : newPinBoardId === ''))}
                        onClick={isOwner ? () => editCreatedPin() : () => editSavedPin()}
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
                        <Select placeholder='Select option' value={newPinBoardId !== '' ? newPinBoardId : pinBoardId} onChange={(e) => setNewPinBoardId(e.target.value)}>
                            {boards.map((board) =>
                                <option key={board.id} value={Number(board.id)}>{board.name}</option>
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

import React, { useEffect, useState } from 'react';
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers'
import { useBoardManager, usePinManager } from '@/common/functions/contracts';
import { useRouter } from 'next/router';
import { List, ListItem } from '@chakra-ui/react';

interface SavePinModalProps {
    pinId: number | null;
}

const SavePinModal: React.FC<SavePinModalProps> = (props: SavePinModalProps) => {
    const { pinId } = props;
    const { savePinModalOpen, setSavePinModalOpen } = useAppState();
    const { account, library } = useWeb3React<Web3Provider>();
    const boardManagerContract = useBoardManager(library);
    const pinManagerContract = usePinManager(library);
    const router = useRouter();
    const [boardId, setBoardId] = useState<number | null>(null);
    const [boards, setBoards] = useState<any[]>([]);

    useEffect(() => {
        getAllBoards();

    }, [account, library]);

    function getAllBoards() {
        boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
            const boards = result.map((board: any) => ({ id: board.id.toNumber(), name: board.name, owner: board.owner, pins: board.pins }));
            getAllPinsByBoard(boards);
        });
    }

    function getAllPinsByBoard(boards: any) {
        boards.forEach((board: any) => {
            pinManagerContract?.getPinsByBoardId(board.id).then((result: any) => {
                setBoards((prevBoards) => {
                    return [...prevBoards.filter(({ id, owner }) => id !== board.id && owner === board.owner), { id: board.id, name: board.name, owner: board.owner, pins: result }]
                        .sort((a, b) => a.id - b.id);
                });
            });
        });
    }

    function savePinToBoard(boardId: number) {
        boardManagerContract?.savePinToBoard(boardId, pinId).then((result: any) => {
            setSavePinModalOpen(false);
        });
    }

    return (
        <Modal isOpen={savePinModalOpen} closeModal={() => setSavePinModalOpen(false)} title='Save to board' height='h-full' >
            <List>
                {boards.map((board: any) => (
                    <ListItem key={board.id} onClick={() => savePinToBoard(board.id)}>
                        <div className='flex items-center h-16'>

                            {board.pins?.length > 0 && board.pins[0].imageHash ? (
                                <img className='w-14 h-14 rounded-xl' src={`https://web3-pinterest.infura-ipfs.io/ipfs/${board.pins[0].imageHash}`} alt='board' />
                            ) : (
                                <div className='bg-gray-200 w-14 h-14 rounded-xl'></div>
                            )}

                            <div className='justify-center ml-4'>
                                <h2 className='text-lg font-bold'>{board.name}</h2>
                            </div>
                        </div>
                    </ListItem>
                ))}
            </List>

        </Modal>
    );
};

export default SavePinModal;

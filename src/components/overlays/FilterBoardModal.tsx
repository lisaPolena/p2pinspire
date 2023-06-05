import { List, ListItem } from '@chakra-ui/react';
import React from 'react';
import { useAppState } from '../general/AppStateContext';
import { IoCheckmarkSharp } from "react-icons/io5";
import Modal from '../general/Modal';

const FilterBoardModal: React.FC = () => {
    const { filterBoardModalOpen, setFilterBoardModalOpen, boardView, setBoardView } = useAppState();

    function handleSetBoardView(view: string) {
        setBoardView(view);
        setFilterBoardModalOpen(false);
    }

    return (
        <Modal modalId='filter-board-modal' isOpen={filterBoardModalOpen} closeModal={() => setFilterBoardModalOpen(false)} title="Set view as" height='h-[30%]'>
            <List>
                <ListItem className='flex flex-row justify-between' onClick={() => handleSetBoardView('wide')}>
                    <p className='mb-4 text-lg font-bold'>Wide</p>
                    {boardView === 'wide' && <IoCheckmarkSharp size={30} />}
                </ListItem>
                <ListItem className='flex flex-row justify-between' onClick={() => handleSetBoardView('default')} >
                    <p className='mb-4 text-lg font-bold'>Default</p>
                    {boardView === 'default' && <IoCheckmarkSharp size={30} />}
                </ListItem>
                <ListItem className='flex flex-row justify-between' onClick={() => handleSetBoardView('compact')}>
                    <p className='mb-4 text-lg font-bold'>Compact</p>
                    {boardView === 'compact' && <IoCheckmarkSharp size={30} />}
                </ListItem>
            </List>

        </Modal>
    );
};

export default FilterBoardModal;

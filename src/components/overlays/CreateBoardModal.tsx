import React from 'react';
import { BsFillPinFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';

interface CreateBoardModalProps {
}

const CreateBoardModal: React.FC<CreateBoardModalProps> = () => {

    const { createBoardModalOpen, setCreateBoardModalOpen } = useAppState();
    //TODO: add transition to modal opening and closing

    return (
        <Modal isOpen={createBoardModalOpen} closeModal={() => setCreateBoardModalOpen(false)} title="Add new Board" height='h-[90%]'>
            ADDBOARD MODAL
        </Modal>
    );
};

export default CreateBoardModal;

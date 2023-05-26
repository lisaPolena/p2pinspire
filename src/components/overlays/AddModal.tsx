import React from 'react';
import { BsFillPinFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import OutsideAlerter from '../general/OutsideClickAlerter';
import Modal from '../general/Modal';

interface AddModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, closeModal }) => {

    //TODO: add transition to modal opening and closing

    return (
        <>
            {isOpen && (
                <Modal isOpen={isOpen} closeModal={closeModal} title="Start creating now">
                    <div className="flex justify-evenly">

                        <div className='flex flex-col items-center justify-center'>
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-500 rounded-xl">
                                <HiClipboardDocumentCheck size={30} />
                            </div>
                            <div className="mt-2 text-sm text-white">Idea Pin</div>
                        </div>

                        <div className='flex flex-col items-center justify-center'>
                            <div className="flex items-center justify-center w-16 h-16 m-auto bg-gray-500 rounded-xl">
                                <BsFillPinFill size={30} />
                            </div>
                            <div className="mt-2 text-sm text-white ">Pin</div>
                        </div>


                        <div className='flex flex-col items-center justify-center'>
                            <div className="flex items-center justify-center w-16 h-16 bg-gray-500 fflex rounded-xl">
                                <MdSpaceDashboard size={30} />
                            </div>
                            <div className="mt-2 text-sm text-white">Board</div>
                        </div>

                    </div>
                </Modal>
            )}
        </>
    );
};

export default AddModal;

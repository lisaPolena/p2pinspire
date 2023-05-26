import React from 'react';
import { IoClose } from "react-icons/io5";
import OutsideAlerter from '../general/OutsideClickAlerter';

interface ModalProps {
    isOpen: boolean;
    closeModal: () => void;
    children: React.ReactNode;
    title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, closeModal, children, title }) => {
    // TODO: add transition to modal opening and closing

    return (
        <>
            {isOpen && (
                <OutsideAlerter action={closeModal}>
                    <div id="add-modal-container" className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 h-[22%] rounded-t-[40px] mr-3 ml-3">
                        <div className="flex items-center justify-between mb-4">
                            <button className="text-white" onClick={closeModal}>
                                <IoClose size={30} />
                            </button>
                            <h2 className="text-base text-white">{title}</h2>
                            <div></div>
                        </div>
                        <div className="mt-8">
                            {children}
                        </div>
                    </div>
                </OutsideAlerter>
            )}
        </>
    );
};

export default Modal;

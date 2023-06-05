import { Button } from '@chakra-ui/react';
import React, { useEffect, useRef } from 'react';
import { IoClose } from "react-icons/io5";
import OutsideAlerter from '../general/OutsideClickAlerter';

interface ModalProps {
    isOpen: boolean;
    isAlternative?: boolean;
    closeModal: () => void;
    children: React.ReactNode;
    title: string;
    height: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, isAlternative, closeModal, children, title, height }) => {
    const modalRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const modalElement = modalRef.current;
        if (modalElement && isOpen) {
            modalElement.classList.add('slide-in');
        } else if (modalElement) {
            modalElement.classList.remove('slide-in');
        }
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <OutsideAlerter action={closeModal}>
                    <div ref={modalRef} id="add-modal-container" className={"absolute bottom-0 left-0 right-0 p-4 bg-zinc-800 rounded-t-[40px] z-10 " + height}>
                        <div className={`flex items-center gap-24 ${!isAlternative ? 'mb-4' : ''}`}>
                            {!isAlternative &&
                                <button className="text-white" onClick={closeModal}>
                                    <IoClose size={30} />
                                </button>
                            }
                            <h2 className={`text-base text-white ${isAlternative ? 'ml-2 mt-4 text-sm' : ''}`}>{title}</h2>
                        </div>
                        <div className={`${!isAlternative ? 'mt-8' : 'mt-4 ml-2'}`}>
                            {children}
                        </div>
                        {isAlternative &&
                            <div className="flex justify-center mt-8">
                                <Button colorScheme="secondary" borderRadius={'50px'} variant='solid' onClick={closeModal}>Close</Button>
                            </div>
                        }
                    </div>
                </OutsideAlerter>
            )}
        </>
    );
};

export default Modal;

import React from 'react';
import { BsFillPinFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import OutsideAlerter from '../general/OutsideClickAlerter';

interface AddModalProps {
    isOpen: boolean;
    closeModal: () => void;
}

const AddModal: React.FC<AddModalProps> = ({ isOpen, closeModal }) => {

    //TODO: add transition to modal opening and closing

    return (
        <>
            {isOpen && (
                <OutsideAlerter action={closeModal}>
                    <div id="add-modal-container" className="fixed bottom-0 left-0 right-0 p-4 bg-zinc-800 h-[22%] rounded-t-[40px] mr-3 ml-3">
                        <div className="flex items-center justify-between mb-4">
                            <button className="text-white" onClick={closeModal}>
                                <IoClose size={30} />
                            </button>
                            <h2 className="text-base text-white">Start creating now</h2>
                            <div></div>
                        </div>
                        <div className="flex mt-8 justify-evenly">

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
                    </div>
                </OutsideAlerter>
            )}
        </>
    );
};

export default AddModal;

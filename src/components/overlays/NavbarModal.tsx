import React from 'react';
import { BsFillPinFill } from "react-icons/bs";
import { MdSpaceDashboard } from "react-icons/md";
import { HiClipboardDocumentCheck } from "react-icons/hi2";
import Modal from '../general/Modal';
import { useAppState } from '../general/AppStateContext';

const NavbarModal: React.FC = () => {
    const { setCreateBoardModalOpen, navbarModalOpen, setNavbarModalOpen, setCreatePinModalOpen } = useAppState();

    return (
        <Modal isOpen={navbarModalOpen} closeModal={() => setNavbarModalOpen(false)} title="Start creating now" height='h-[22%]'>
            <div className="flex justify-evenly">

                <div className='flex flex-col items-center justify-center'>
                    <div className="flex items-center justify-center w-16 h-16 bg-[#7f7d82] rounded-xl">
                        <HiClipboardDocumentCheck size={30} />
                    </div>
                    <div className="mt-2 text-sm text-white">Idea Pin</div>
                </div>

                <div className='flex flex-col items-center justify-center' onClick={() => setCreatePinModalOpen(true)}>
                    <div className="flex items-center justify-center w-16 h-16 m-auto bg-[#7f7d82] rounded-xl">
                        <BsFillPinFill size={30} />
                    </div>
                    <div className="mt-2 text-sm text-white ">Pin</div>
                </div>

                <div className='flex flex-col items-center justify-center' onClick={() => setCreateBoardModalOpen(true)}>
                    <div className="flex items-center justify-center w-16 h-16 bg-[#7f7d82] fflex rounded-xl">
                        <MdSpaceDashboard size={30} />
                    </div>
                    <div className="mt-2 text-sm text-white">Board</div>
                </div>

            </div>
        </Modal>
    );
};

export default NavbarModal;

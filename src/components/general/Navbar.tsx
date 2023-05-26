import Link from 'next/link';
import { useState } from 'react';
import { IoHome, IoSearch, IoAdd, IoChatbubbleEllipses, IoPersonCircle } from "react-icons/io5";
import AddModal from '../overlays/AddModal';

export const Navbar = () => {
  const [addModalOpen, setAddModalOpen] = useState<boolean>(false);

  const closeAddModal = () => {
    setAddModalOpen(false);
  };

  return (
    <>
      <div className='fixed inset-x-0 bottom-0 flex justify-between bg-black'>
        <Link href={''} className='flex justify-center w-full px-3 py-5 ml-10 align-center'>
          <div className='text-2xl'><IoHome /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center'>
          <div className='text-2xl'><IoSearch /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center' onClick={() => setAddModalOpen(true)}>
          <div className='text-2xl'><IoAdd /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center'>
          <div className='text-2xl'><IoChatbubbleEllipses /></div>
        </Link>
        <Link href={'/profile'} className='flex justify-center w-full px-3 py-5 mr-10 align-center'>
          <div className='text-2xl'><IoPersonCircle /></div>
        </Link>
      </div>
      <AddModal isOpen={addModalOpen} closeModal={closeAddModal} />
    </>
  );
};
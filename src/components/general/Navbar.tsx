import Link from 'next/link';
import { IoHome, IoSearch, IoAdd, IoChatbubbleEllipses, IoPersonCircle } from "react-icons/io5";
import CreateBoardModal from '../overlays/CreateBoardModal';
import NavbarModal from '../overlays/NavbarModal';
import { useAppState } from './AppStateContext';

export const Navbar = () => {
  const { setNavbarModalOpen, loadDeleteBoardTransaction } = useAppState();

  return (
    <>
      <div className={`fixed inset-x-0 bottom-0 flex justify-between bg-black ${loadDeleteBoardTransaction ? 'z-20' : ''}`}>
        <Link href={''} className='flex justify-center w-full px-3 py-5 ml-10 align-center'>
          <div className='text-2xl'><IoHome /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center'>
          <div className='text-2xl'><IoSearch /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center' onClick={() => setNavbarModalOpen(true)}>
          <div className='text-2xl'><IoAdd /></div>
        </Link>
        <Link href={''} className='flex justify-center w-full px-3 py-5 align-center'>
          <div className='text-2xl'><IoChatbubbleEllipses /></div>
        </Link>
        <Link href={'/profile'} className='flex justify-center w-full px-3 py-5 mr-10 align-center'>
          <div className='text-2xl'><IoPersonCircle /></div>
        </Link>
      </div>
      <NavbarModal />
      <CreateBoardModal />
    </>
  );
};
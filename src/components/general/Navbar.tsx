import Link from 'next/link';
import { IoHome, IoSearch, IoAdd, IoChatbubbleEllipses, IoPersonCircle } from "react-icons/io5";

export const Navbar = () => {
  return (
    <div className='fixed inset-x-0 bottom-0 flex justify-between bg-black'>
      <Link href={''} className='flex justify-center block w-full px-3 py-5 ml-10 align-center'>
        <div className='text-2xl'><IoHome /></div>
      </Link>
      <Link href={''} className='flex justify-center block w-full px-3 py-5 align-center'>
        <div className='text-2xl'><IoSearch /></div>
      </Link>
      <Link href={''} className='flex justify-center block w-full px-3 py-5 align-center'>
        <div className='text-2xl'><IoAdd /></div>
      </Link>
      <Link href={''} className='flex justify-center block w-full px-3 py-5 align-center'>
        <div className='text-2xl'><IoChatbubbleEllipses /></div>
      </Link>
      <Link href={'/profile'} className='flex justify-center block w-full px-3 py-5 mr-10 align-center'>
        <div className='text-2xl'><IoPersonCircle /></div>
      </Link>
    </div>
  );
};
import Link from 'next/link';
import { IoHome,IoSearch,IoAdd,IoChatbubbleEllipses,IoPersonCircle } from "react-icons/io5";

export const Navbar = () => {
  return (
    <div className='fixed bottom-0 bg-black inset-x-0 flex justify-between'>
        <Link href={''} className='w-full block py-5 px-3 flex justify-center align-center ml-10'>
        <div className='text-2xl'><IoHome /></div>
        </Link>
        <Link href={''} className='w-full block py-5 px-3 flex justify-center align-center'>
        <div className='text-2xl'><IoSearch /></div>
        </Link>
        <Link href={''} className='w-full block py-5 px-3 flex justify-center align-center'>
        <div className='text-2xl'><IoAdd /></div>
        </Link>
        <Link href={''} className='w-full block py-5 px-3 flex justify-center align-center'>
        <div className='text-2xl'><IoChatbubbleEllipses /></div>
        </Link>
        <Link href={''} className='w-full block py-5 px-3 flex justify-center align-center mr-10'>
        <div className='text-2xl'><IoPersonCircle /></div>
        </Link>
    </div>
  );
};
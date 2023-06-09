import Head from 'next/head'
import { useSession } from "next-auth/react"
import { useAccount, useContractRead, useContractWrite } from "wagmi"
import { useEffect, useState } from "react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'
import userManager from '../contracts/build/UserManager.json';
import { Toast } from '@/components/general/Toasts'
import { useToast } from '@chakra-ui/react'
import { User } from '@/common/types/structs'
import { useAppState } from '@/components/general/AppStateContext'
import CreateProfileModal from '@/components/overlays/user/CreateProfileModal'
import { storeUserInStorage } from '@/common/functions/users'

export default function Index() {
  const { address, isConnected } = useAccount()
  const { data: session, status } = useSession()
  const { setUser } = useAppState();
  const router = useRouter();
  const toast = useToast();
  const [createUserModalOpen, setCreateUserModalOpen] = useState<boolean>(false);

  const {
    data: createUserData,
    status: createUserStatus,
    writeAsync: createUser,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: 'createUser',
    onError(err) {
      console.log(err);
    }
  });

  const { data: userData } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: 'getUserByAddress',
    args: [address],
    onError(error) {
      console.log('getUserByAdress', error);
    },
  });

  useEffect(() => {
    if (isConnected && status === 'authenticated' && session) {

      if (userData) {
        const res = userData as User;
        if (res.userAddress === address) {
          setUser(res);
          storeUserInStorage(res);
          router.push('/home');
          return;
        }
      }

      const timeout = setTimeout(() => {
        setCreateUserModalOpen(true);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      }

    }
  }, [isConnected, session, userData])

  async function handleCreateUser() {
    handleToast('Creating user...', '');
    await createUser({ args: [address] });
    setCreateUserModalOpen(false);
  }

  function handleToast(message: string, imageHash: string) {
    toast({
      position: 'top',
      render: () => (
        <Toast text={message} imageHash={imageHash} />
      ),
    })
  }

  function handleCloseCreateUserModal() {
    setCreateUserModalOpen(false);
  }

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="fixed flex flex-col items-center justify-end h-screen scroll-background">
        <div className="z-10 flex flex-col h-[40vh] bg-black justify-between w-screen items-center pt-12 pb-8 shadow-index">
          <img className='w-24' src='/assets/logo.png' alt='Logo'></img>
          <h2>Welcome to Web3 Pinterest</h2>
          <ConnectButton accountStatus={'full'} label='Connect' />
        </div>
      </main>
      <CreateProfileModal isOpen={createUserModalOpen} closeModal={handleCloseCreateUserModal} handleCreateUser={handleCreateUser} />
    </>
  )
}

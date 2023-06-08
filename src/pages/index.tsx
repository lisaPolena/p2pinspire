import Head from 'next/head'
import { useSession } from "next-auth/react"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useRouter } from 'next/router'

export default function Index() {
  const { address, isConnected } = useAccount()
  const { data: session, status } = useSession()
  const router = useRouter();

  useEffect(() => {
    if (isConnected && status === 'authenticated' && session) {
      router.push('/home')
    }
  }, [isConnected, session])

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
    </>
  )
}

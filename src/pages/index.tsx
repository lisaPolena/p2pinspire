import Head from 'next/head'
import { Button } from '@chakra-ui/react'
import { useEffect } from 'react'
import { UnsplashClient } from '@/common/unsplashClient'
import { useWeb3React } from "@web3-react/core";
import { injected } from "../wallet/connect";

export default function Index() {
  // active: returns a boolean to check if user is connected
  // account: returns the users account (or .eth name)
  // libary: provides web3React functions to interact with the blockchain / smart contracts
  // activate: to authenticate the user’s wallet
  // deactivate: to log out the user
  const { active, account, library, activate, deactivate } = useWeb3React()

  useEffect(() => {
    UnsplashClient.getRandomPhotos();
  }, [])

  async function connect() {
    try {
      await activate(injected);
    } catch (ex) {
      console.log(ex)
    }
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
          <Button width={'70%'} borderRadius={'50px'} colorScheme='primary' variant='solid' onClick={connect}>
            Connect MetaMask
          </Button>
        </div>
      </main>
    </>
  )
}

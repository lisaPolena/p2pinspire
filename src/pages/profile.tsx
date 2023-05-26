import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { Button } from '@chakra-ui/react';
import { useAppState } from '@/components/general/AppStateContext';

export default function Profile() {
    // active: returns a boolean to check if user is connected
    // account: returns the users account (or .eth name)
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    // deactivate: to log out the user
    const { active, account, library, deactivate } = useWeb3React()
    const router = useRouter();
    const { setDisconnected } = useAppState();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!active) router.push('/');
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        };

    }, [active])

    function disconnect() {
        try {
            deactivate();
            setDisconnected(true)
            router.push('/');
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
            <main className='h-screen bg-black'>
                <Button width={'70%'} borderRadius={'50px'} colorScheme='primary' variant='solid' onClick={disconnect}>
                    Disconnect MetaMask
                </Button>
            </main>
            <Navbar />
        </>
    )
}

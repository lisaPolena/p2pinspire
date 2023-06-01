import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { Tabs, TabList, Tab, TabPanels, TabPanel } from '@chakra-ui/react';

export default function Profile() {
    // active: returns a boolean to check if user is connected
    // account: returns the users account (or .eth name)
    // libary: provides web3React functions to interact with the blockchain / smart contracts
    // deactivate: to log out the user
    const { active, account, library, deactivate } = useWeb3React()
    const router = useRouter();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!active) router.push('/');
        }, 2000);

        return () => {
            clearTimeout(timeoutId);
        };

    }, [active])

    function formatMetamaskAddress(address: string): string {
        const formattedAddress = `${address.slice(0, 5)}...${address.slice(-4)}`;
        return formattedAddress;
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
                <div className='w-[95%] h-1/3 flex flex-col justify-center items-center'>
                    {account && <p className='text-lg font-bold'>{formatMetamaskAddress(account)}</p>}
                </div>

                <div className='flex flex-col items-center h-2/3'>
                    <Tabs variant='soft-rounded' colorScheme='primary' defaultIndex={1} size='md' align='center'>
                        <TabList>
                            <Tab>Created</Tab>
                            <Tab>Saved</Tab>
                        </TabList>
                        <TabPanels>
                            <TabPanel>
                                <p>one!</p>
                            </TabPanel>
                            <TabPanel width='100vw'>
                                <div className='grid grid-cols-2 gap-4'>
                                    {[{ title: 'Board title', pins: 42 }, { title: 'Board 2 title', pins: 42 }].map(({ title, pins }) => (
                                        <div className='text-left'>
                                            <div className='h-[120px] bg-white rounded-3xl'>
                                            </div>
                                            <p>{title}</p>
                                            <p className='text-xs text-gray-400'>{pins} Pins</p>
                                        </div>
                                    ))}
                                </div>

                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </div>

            </main>
            <Navbar />
        </>
    )
}

import { usePinManager } from '@/common/functions/contracts';
import { AppBar } from '@/components/general/AppBar';
import { Button } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function DetailPin() {
    const { library } = useWeb3React<Web3Provider>()
    const pinManagerContract = usePinManager(library);
    const router = useRouter()
    const [pin, setPin] = useState<any>(null);
    //const ipfs = useIpfs();

    useEffect(() => {
        const { id } = router.query
        getPinById(id as string);

    }, [])

    function getPinById(id: string) {
        pinManagerContract?.getPinById(id).then((result: any) => {
            console.log(result);
            setPin({
                id: result.id.toNumber(),
                title: result.title,
                description: result.description,
                owner: result.owner,
                imageHash: result.imageHash,
                boardId: result.boardId.toNumber()
            });
        });
    }

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='flex flex-col min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={false} isSavedPin={true} pin={pin} />
                <div className=''>
                    <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`} alt={pin?.title}
                        className="object-cover w-full rounded-tl-3xl rounded-tr-3xl " />
                    <div className='p-4 bg-zinc-800 rounded-bl-3xl rounded-br-3xl'>
                        <h1 className='text-2xl font-semibold'>{pin?.title}</h1>
                        <p>{pin?.description}</p>
                        <div className='flex flex-row justify-center gap-4 mt-6'>
                            <Button width={'30%'} borderRadius={'50px'} colorScheme='secondary' variant='solid' onClick={() => console.log('view')}>
                                View
                            </Button>
                            <Button width={'30%'} borderRadius={'50px'} colorScheme='primary' variant='solid' onClick={() => console.log('save')}>
                                Save
                            </Button>
                        </div>
                    </div>
                </div>
            </main>


        </>
    )
}

import { useBoardManager } from '@/common/functions/contracts';
import { AppBar } from '@/components/general/AppBar';
import { Spinner } from '@chakra-ui/react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'


export default function DetailBoard() {
    const { library } = useWeb3React<Web3Provider>()
    const boardManagerContract = useBoardManager(library);
    const [board, setBoard] = useState<any>(null);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const router = useRouter()

    useEffect(() => {
        const { id } = router.query

        getBoardById(id as string);

        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setShowTitle(scrollPosition > 0);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [])

    function getBoardById(id: string) {
        boardManagerContract?.getBoardById(id).then((result: any) => setBoard(result));
    }

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='min-h-screen bg-black mb-18'>
                <AppBar isBoard={true} title={board ? board.name : ''} showTitle={showTitle} board={board} />
                {board ? (
                    <div className='relative top-[50px]'>
                        <h1 className="mt-10 mb-10 text-white">{board ? board.name : ''}</h1>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                        <p>
                            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ex perferendis nobis quia error impedit, corrupti quis modi adipisci officia sed, delectus labore ut! Temporibus consectetur quo eius perspiciatis quam corrupti!
                        </p>
                    </div>
                ) : (
                    <Spinner
                        thickness='4px'
                        speed='0.65s'
                        emptyColor='gray.200'
                        color='blue.500'
                        size='xl'
                    />
                )}
            </main>


        </>
    )
}

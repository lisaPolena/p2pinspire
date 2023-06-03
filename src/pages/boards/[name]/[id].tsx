import { useBoardManager, useIpfs, usePinManager } from '@/common/functions/contracts';
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
    const pinManagerContract = usePinManager(library);
    const [board, setBoard] = useState<any>(null);
    const [showTitle, setShowTitle] = useState<boolean>(false);
    const router = useRouter()
    const [pins, setPins] = useState<any[]>([]);
    //const ipfs = useIpfs();

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
        boardManagerContract?.getBoardById(id).then((result: any) => {
            setBoard(result);
            getPinsByBoardId(id);
        });
    }

    function getPinsByBoardId(id: string) {
        pinManagerContract?.getPinsByBoardId(id).then((result: any) => {
            setPins(result.map((pin: any) => ({ id: pin.id, title: pin.title, description: pin.description, owner: pin.owner, imageHash: pin.imageHash, boardId: pin.boardId })));
        });
    }

    async function downloadImage(hash: string, title: string) {
        const imageSrc = `https://web3-pinterest.infura-ipfs.io/ipfs/${hash}`;
        // const resp = await ipfs.get(hash);
        // let content: any[] = [];
        // for await (const chunk of resp) {
        //     content.push(chunk);
        // }
        // console.log(content.toString());
        // Buffer.from(content).toString('base64')
        // console.log(content);
        // const blob = new Blob(content, { type: 'image/png' });
        // console.log(blob);
        // const src = URL.createObjectURL(blob);
        // console.log(src);

        const response = await fetch(imageSrc);
        const blobImage = await response.blob();
        const href = URL.createObjectURL(blobImage);

        const anchorElement = document.createElement('a');
        anchorElement.href = href;
        anchorElement.download = title;

        document.body.appendChild(anchorElement);
        anchorElement.click();

        document.body.removeChild(anchorElement);
        window.URL.revokeObjectURL(href);
    }

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={true} title={board ? board.name : ''} showTitle={showTitle} board={board} />
                {board ? (
                    <div className='relative top-[50px]'>
                        <div className='mt-10 mb-10 text-center'>
                            <h1 className="text-3xl font-bold text-white mx-auto break-normal max-w-[12rem]">
                                {board ? board.name : ''}
                            </h1>
                        </div>
                        <div>
                            <p className='text-[1.2rem] ml-[1.3rem] mb-[0.4rem] font-semibold'>{pins && pins.length ? pins.length + ' Pins' : '0 Pins'}</p>
                        </div>
                        <div className="grid grid-cols-2 gap-3 px-4">
                            {pins.map((pin: any) => (
                                <div key={pin.id} className="h-auto" onClick={() => console.log(pin.id.toNumber())}>
                                    <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                                        alt={pin.title} className="object-cover w-full rounded-2xl max-h-72" />
                                    <div className='mb-4'>
                                        <h2 className="pt-2 pl-2 text-white font-semibold text-[0.9rem]">{pin.title}</h2>
                                    </div>
                                </div>
                            ))}
                        </div>
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

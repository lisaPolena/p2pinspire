import { Board, Pin } from '@/common/types/structs';
import { AppBar } from '@/components/general/AppBar';
import { useAppState } from '@/components/general/AppStateContext';
import SavePinModal from '@/components/overlays/SavePinModal';
import { Button } from '@chakra-ui/react';
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { useAccount, useContractRead } from 'wagmi';
import pinManager from '../../contracts/build/PinManager.json';
import boardManager from '../../contracts/build/BoardManager.json';

export default function DetailPin() {
    const { address, isConnected } = useAccount()
    const router = useRouter()
    const [pin, setPin] = useState<Pin>();
    const [board, setBoard] = useState<Board>();
    const { downloadPin, setDownloadPin, setSavePinModalOpen } = useAppState();
    const [savePinId, setSavePinId] = useState<number | null>(null);
    const [isSavedPin, setIsSavedPin] = useState<boolean>(false);

    const { data: pinbyId, error: pinIdError } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
        abi: pinManager.abi,
        functionName: 'getPinById',
        enabled: !!router.query.id,
        args: [router.query.id ?? ''],
        onSuccess(data) {
            const res = data as Pin;
            setPin(res);
        },
    });

    const { data: boardById, error: boardIdError } = useContractRead({
        address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
        abi: boardManager.abi,
        functionName: 'getBoardById',
        enabled: !!router.query.boardId,
        args: [router.query.boardId ?? ''],
        onSuccess(data) {
            const res = data as Board;
            setBoard(res);
        },
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (!isConnected) router.push('/');
        }, 2000);

        if (board && board.owner !== address)
            router.push('/profile');

        if (router.query.boardId || pin?.owner === address) setIsSavedPin(true)
        else setIsSavedPin(false);

        if (pin && downloadPin) downloadImage(pin.imageHash, pin.title);

        return () => {
            clearTimeout(timeoutId);
        };

    }, [router.query, downloadPin, address, isConnected, board, pin]);

    async function downloadImage(hash: string, title: string) {
        const imageSrc = `https://web3-pinterest.infura-ipfs.io/ipfs/${hash}`;

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
        setDownloadPin(false);
    }

    function handleSavePinToBoard(pinId: number, isOwner: boolean) {
        if (!isOwner) {
            setSavePinId(pinId);
            setSavePinModalOpen(true);
        }
    }

    return (
        <>
            <Head>
                <title>Detail</title>
            </Head>
            <main className='flex flex-col min-h-screen overflow-auto bg-black mb-18'>
                <AppBar isBoard={false} isSavedPin={isSavedPin} pin={pin} />
                {pin ? (
                    <div className=''>
                        <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`} alt={pin?.title}
                            className="object-cover w-full rounded-tl-3xl rounded-tr-3xl " />
                        <div className='p-4 bg-zinc-800 rounded-bl-3xl rounded-br-3xl'>
                            <h1 className='text-2xl font-semibold'>{pin?.title}</h1>
                            <p>{pin?.description}</p>
                            <div className='flex flex-row justify-center gap-4 mt-6'>
                                <Button width={'30%'} borderRadius={'50px'} colorScheme='tertiary' variant='solid' onClick={() => console.log('view')}>
                                    View
                                </Button>
                                <Button width={'30%'} borderRadius={'50px'} colorScheme={isSavedPin ? 'secondary' : 'primary'} variant='solid' onClick={() => handleSavePinToBoard(Number(pin.id), isSavedPin)}>
                                    {isSavedPin ? 'Saved' : 'Save'}
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className='flex flex-col items-center justify-center h-full'>
                        <p className='text-2xl font-semibold'>Loading...</p>
                    </div>
                )}
            </main>
            <SavePinModal pinId={savePinId} />
        </>
    )
}

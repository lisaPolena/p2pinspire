import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { usePinManager } from '@/common/functions/contracts';

export default function Home() {
  // active: returns a boolean to check if user is connected
  const { active, library, account } = useWeb3React()
  const router = useRouter();
  const pinManagerContract = usePinManager(library);
  const [pins, setPins] = useState<any[]>([]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!active) router.push('/');
    }, 2000);

    getAllPins();

    return () => {
      clearTimeout(timeoutId);
    };

  }, [active, library, account])

  function getAllPins() {
    pinManagerContract?.getAllPins().then((result: any) => {
      const pins = result.map((pin: any) => ({ id: pin.id.toNumber(), title: pin.title, description: pin.description, imageHash: pin.imageHash, boardId: pin.boardId.toNumber(), owner: pin.owner }));
      setPins(pins.filter((pin: { owner: any; }) => pin.owner !== account));
    });
  }

  return (
    <>
      <Head>
        <title>Web3 Pinterest</title>
        <meta name="description" content="Web3 Pinterest" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className='h-screen overflow-auto bg-black'>
        <div className={`fixed inset-x-0 top-0 grid grid-cols-3 bg-black h-[50px] pt-3 px-2 z-10`}>
        </div>

        <div className="grid grid-cols-2 gap-3 px-4 relative top-[50px] mt-2">
          {pins.map((pin: any) => (
            <div key={pin.id} className="h-auto" onClick={() => router.push(`/pin/${pin.id}`)}>
              <img src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin.imageHash}`}
                alt={pin.title} className="object-cover w-full rounded-2xl max-h-72" />
              <div className='mb-4'>
                <h2 className="pt-2 pl-2 text-white font-semibold text-[0.9rem]">{pin.title}</h2>
              </div>
            </div>
          ))}
        </div>

      </main>
      <Navbar />
    </>
  )
}

import Head from 'next/head'
import { Navbar } from '@/components/general/Navbar'
import { useEffect, useState } from 'react'
import { useWeb3React } from '@web3-react/core';
import { useRouter } from 'next/router';
import { useBoardManager, usePinManager } from '@/common/functions/contracts';
import { useAppState } from '@/components/general/AppStateContext';

export default function Home() {
  // active: returns a boolean to check if user is connected
  const { active, library, account } = useWeb3React()
  const router = useRouter();
  const pinManagerContract = usePinManager(library);
  const boardManagerContract = useBoardManager(library);
  const [pins, setPins] = useState<any[]>([]);
  const { allBoards, setAllBoards } = useAppState();

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!active) router.push('/');
    }, 2000);

    getAllBoards();

    boardManagerContract?.on('PinSaved', () => getAllBoards());

    return () => {
      clearTimeout(timeoutId);
      boardManagerContract?.off('PinSaved', () => getAllBoards());
    };

  }, [active, library, account])

  function getAllPins(boards: any[]) {
    const boardPins = boards.map((board: any) => board.pins.map((pin: any) => pin)).flat();
    pinManagerContract?.getAllPins().then((result: any) => {
      const pins = result.map((pin: any) => ({ id: pin.id.toNumber(), title: pin.title, description: pin.description, imageHash: pin.imageHash, boardId: pin.boardId.toNumber(), owner: pin.owner }));
      setPins(pins.filter((pin: { owner: any; id: number; }) => pin.owner !== account && !boardPins.includes(pin.id)));
    });
  }

  function getAllBoards() {
    boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
      const boards = result.map((board: any) => ({ id: board.id.toNumber(), name: board.name, owner: board.owner, pins: board.pins.map((pin: any) => pin.toNumber()) }));
      getAllPins(boards);
    });
  }

  // function getAllBoards() {
  //   boardManagerContract?.getBoardsByOwner(account).then((result: any) => {
  //     const boards = result.map((board: any) => ({ id: board.id.toNumber(), name: board.name, owner: board.owner, pins: board.pins }));
  //     setAllBoards(boards);
  //     getAllPinsByBoard(boards);
  //   });
  // }

  // function getAllPinsByBoard(boards: any) {
  //   boards.forEach((board: any) => {
  //     pinManagerContract?.getPinsByBoardId(board.id).then((result: any) => {
  //       let pins = result.map((pin: any) => ({ id: pin.id.toNumber(), title: pin.title, description: pin.description, owner: pin.owner, imageHash: pin.imageHash, boardId: pin.boardId.toNumber() }));
  //       board.pins.forEach((pinId: any) => {
  //         pinManagerContract.getPinById(pinId.toNumber()).then((result: any) => {
  //           pins = [...pins, { id: result.id.toNumber(), title: result.title, description: result.description, owner: result.owner, imageHash: result.imageHash, boardId: result.boardId.toNumber() }]
  //           let index = allBoards.findIndex(({ id }) => id === board.id);
  //           if (index != -1) allBoards[index].pins = pins;
  //           setAllBoards(allBoards);
  //         });
  //       });
  //     });
  //   });
  // }

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

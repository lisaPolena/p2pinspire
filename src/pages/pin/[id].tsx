import { Board, Pin, PinOwnerData } from "@/common/types/structs";
import { AppBar } from "@/components/general/AppBar";
import { useAppState } from "@/components/general/AppStateContext";
import SavePinModal from "@/components/overlays/pin/SavePinModal";
import { Button, useToast } from "@chakra-ui/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useAccount, useContractEvent, useContractRead } from "wagmi";
import pinManager from "../../contracts/build/PinManager.json";
import boardManager from "../../contracts/build/BoardManager.json";
import userManager from "../../contracts/build/UserManager.json";
import { Toast } from "@/components/general/Toasts";

export default function DetailPin() {
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [pin, setPin] = useState<Pin>();
  const [board, setBoard] = useState<Board>();
  const { downloadPin, setDownloadPin, setSavePinModalOpen } = useAppState();
  const [savePinId, setSavePinId] = useState<number | null>(null);
  const [isSavedPin, setIsSavedPin] = useState<boolean>(false);
  const toast = useToast();
  const [pinOwner, setPinOwner] = useState<PinOwnerData | null>(null);

  const { data: pinbyId, error: pinIdError } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    functionName: "getPinById",
    enabled: !!router.query.id,
    args: [router.query.id ?? ""],
    onSuccess(data) {
      const res = data as Pin;
      setPin(res);
    },
  });

  const { data: boardById, error: boardIdError } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT}`,
    abi: boardManager.abi,
    functionName: "getBoardById",
    enabled: !!router.query.boardId,
    args: [router.query.boardId ?? ""],
    onSuccess(data) {
      const res = data as Board;
      setBoard(res);
    },
  });

  const { data: pinOwnerData } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: "getUserByAddress",
    enabled: !!pin?.owner,
    args: [pin?.owner],
    onError(error) {
      console.log("getUserByAdress", error);
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT}`,
    abi: pinManager.abi,
    eventName: "CreatedPinEdited",
    listener(log: any) {
      const args = log[0].args;
      const newPin = {
        ...pin,
        title: args.newTitle,
        description: args.newDescription,
        imageHash: args.imageHash,
      } as Pin;
      setPin(newPin);
      const message = "Pin " + args.newTitle + " edited!";
      handleEditPinToast(message, args.imageHash);
    },
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (!isConnected) router.push("/");
    }, 2000);

    if (board && board.owner !== address) router.push("/profile");

    if (router.query.boardId || pin?.owner === address) setIsSavedPin(true);
    else setIsSavedPin(false);

    console.log("pinOwnerData", pinOwnerData);

    if (pinOwnerData) {
      const res = pinOwnerData as PinOwnerData;
      const shortAddress =
        res.userAddress.substring(0, 6) +
        "..." +
        res.userAddress.substring(
          res.userAddress.length - 4,
          res.userAddress.length
        );
      setPinOwner({
        userAddress: shortAddress,
        name: res.name,
        profileImageHash: res.profileImageHash,
      });
    }

    if (pin && downloadPin) downloadImage(pin.imageHash, pin.title);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [
    router.query,
    downloadPin,
    address,
    isConnected,
    board,
    pin,
    pinOwnerData,
  ]);

  async function downloadImage(hash: string, title: string) {
    const imageSrc = `https://web3-pinterest.infura-ipfs.io/ipfs/${hash}`;

    const response = await fetch(imageSrc);
    const blobImage = await response.blob();
    const href = URL.createObjectURL(blobImage);

    const anchorElement = document.createElement("a");
    anchorElement.href = href;
    anchorElement.download = title;

    document.body.appendChild(anchorElement);
    anchorElement.click();

    document.body.removeChild(anchorElement);
    window.URL.revokeObjectURL(href);
    setDownloadPin(false);

    const message = "Image downloading...";
    toast({
      position: "top",
      render: () => <Toast text={message} />,
    });
  }

  function handleSavePinToBoard(pinId: number, isOwner: boolean) {
    if (!isOwner) {
      setSavePinId(pinId);
      setSavePinModalOpen(true);
    }
  }

  function handleEditPinToast(message: string, imageHash: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  return (
    <>
      <Head>
        <title>Detail</title>
      </Head>
      <main className="flex flex-col min-h-screen overflow-auto bg-black mb-18">
        <AppBar
          isBoard={false}
          isSavedPin={isSavedPin}
          isProfile={false}
          pin={pin}
        />
        {pin ? (
          <div className="">
            <img
              src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pin?.imageHash}`}
              alt={pin?.title}
              className="object-cover w-full rounded-tl-3xl rounded-tr-3xl "
            />
            <div className="p-4 bg-zinc-800 rounded-bl-3xl rounded-br-3xl">
              {pinOwner && (
                <div
                  className="flex items-center gap-3 mb-4"
                  onClick={() => router.push(`/profile/${pin.owner}`)}
                >
                  {pinOwner.profileImageHash !== "" ? (
                    <img
                      src={`https://web3-pinterest.infura-ipfs.io/ipfs/${pinOwner.profileImageHash}`}
                      alt={pinOwner.name}
                      className="w-10 h-10 rounded-full"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-zinc-600" />
                  )}
                  <p className="text-sm font-semibold">
                    {pinOwner.name != ""
                      ? pinOwner.name + " - " + pinOwner.userAddress
                      : pinOwner.userAddress}
                  </p>
                </div>
              )}
              <h1 className="text-2xl font-semibold">{pin?.title}</h1>
              <p>{pin?.description}</p>
              <div className="flex flex-row justify-center gap-4 mt-6">
                <Button
                  width={"30%"}
                  borderRadius={"50px"}
                  colorScheme="tertiary"
                  variant="solid"
                  onClick={() => console.log("view")}
                >
                  View
                </Button>
                <Button
                  width={"30%"}
                  borderRadius={"50px"}
                  colorScheme={isSavedPin ? "secondary" : "primary"}
                  variant="solid"
                  onClick={() =>
                    handleSavePinToBoard(Number(pin.id), isSavedPin)
                  }
                >
                  {isSavedPin ? "Saved" : "Save"}
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full">
            <p className="text-2xl font-semibold">Loading...</p>
          </div>
        )}
      </main>
      <SavePinModal pinId={savePinId} />
    </>
  );
}

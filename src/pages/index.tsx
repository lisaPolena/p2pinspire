import Head from "next/head";
import { useSession } from "next-auth/react";
import {
  useAccount,
  useContractEvent,
  useContractRead,
  useContractWrite,
} from "wagmi";
import { useEffect, useState } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/router";
import userManager from "../contracts/build/UserManager.json";
import { Toast } from "@/components/general/Toasts";
import { useToast } from "@chakra-ui/react";
import { User } from "@/common/types/structs";
import { useAppState } from "@/components/general/AppStateContext";
import CreateProfileModal from "@/components/overlays/user/CreateProfileModal";
import { storeUserInStorage } from "@/common/functions/users";
import Image from "next/image";

export default function Index() {
  const { address, isConnected } = useAccount();
  const { data: session, status } = useSession();
  const { setUser, deleteProfile } = useAppState();
  const router = useRouter();
  const toast = useToast();
  const [createUserModalOpen, setCreateUserModalOpen] =
    useState<boolean>(false);
  const [isCreating, setIsCreating] = useState<boolean>(false);

  const {
    data: createUserData,
    status: createUserStatus,
    writeAsync: createUser,
  } = useContractWrite({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: "createUser",
  });

  const { data: allUsers } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: "getAllUsers",
    onSuccess(data) {
      //console.log(data);
    },
  });

  useContractEvent({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    eventName: "UserCreated",
    listener(log: any) {
      const res = log[0].args as User;
      if (res.userAddress === address) {
        setUser({ id: Number(res.id), userAddress: res.userAddress });
        storeUserInStorage(res);
        setIsCreating(false);
        router.push("/home");
      }
    },
  });

  useEffect(() => {
    if (isConnected && status === "authenticated" && session) {
      if (allUsers) {
        const res = allUsers as User[];
        if (deleteProfile === address) return;
        if (
          res.length > 0 &&
          res.find((user) => user.userAddress === address)
        ) {
          const user = res.find((user) => user.userAddress === address);
          if (user) {
            setUser(user);
            storeUserInStorage(user);
            router.push("/home");
            return;
          }
        }
      }

      const timeout = setTimeout(() => {
        if (isCreating) return;
        setCreateUserModalOpen(true);
      }, 2000);

      return () => {
        clearTimeout(timeout);
      };
    }
  }, [isConnected, session, allUsers]);

  async function handleCreateUser() {
    await createUser({ args: [address] })
      .then(() => {
        setCreateUserModalOpen(false);
        setIsCreating(true);
        handleToast("Creating user...");
      })
      .catch((err) => {
        setCreateUserModalOpen(false);
        handleToast("Transaction rejected");
      });
  }

  function handleToast(message: string, imageHash?: string) {
    toast({
      position: "top",
      render: () => <Toast text={message} imageHash={imageHash} />,
    });
  }

  function handleCloseCreateUserModal() {
    setCreateUserModalOpen(false);
  }

  return (
    <>
      <Head>
        <title>P2Pinspire</title>
        <meta name="description" content="P2Pinspire" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="fixed flex flex-col items-center justify-end h-screen scroll-background">
        <div className="z-10 flex flex-col h-[40vh] bg-black justify-between w-screen items-center pt-12 pb-8 shadow-index">
          <Image
            className="w-24"
            src="/assets/logo.png"
            alt="Logo"
            width={100}
            height={100}
          ></Image>
          <h2 className="text-2xl font-bold">Welcome to P2Pinspire</h2>
          <ConnectButton accountStatus={"full"} label="Connect" />
        </div>
      </main>
      <CreateProfileModal
        isOpen={createUserModalOpen}
        closeModal={handleCloseCreateUserModal}
        handleCreateUser={handleCreateUser}
      />
    </>
  );
}

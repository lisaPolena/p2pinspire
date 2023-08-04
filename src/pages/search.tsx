import { Navbar } from "@/components/general/Navbar";
import Head from "next/head";
import { useEffect } from "react";
import { useContractRead } from "wagmi";
import userManager from "../contracts/build/UserManager.json";

export default function Search() {
  const { data: allUsers } = useContractRead({
    address: `0x${process.env.NEXT_PUBLIC_USER_MANAGER_CONTRACT}`,
    abi: userManager.abi,
    functionName: "getAllUsers",
    onSuccess(data) {
      //console.log(data);
    },
  });

  useEffect(() => {
    //console.log(allUsers);
  }, []);

  return (
    <>
      <Head>
        <title>Profile</title>
      </Head>
      <main className="min-h-screen bg-black">
        <div className="absolute z-[10] top-2 left-28"></div>
      </main>
      <Navbar />
    </>
  );
}

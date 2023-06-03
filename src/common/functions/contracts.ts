import { Contract } from "ethers/lib/ethers";
import { Web3Provider } from '@ethersproject/providers'
import { useMemo } from "react";
import boardManager from '../../contracts/build/BoardManager.json';
import pinManager from '../../contracts/build/PinManager.json';
import { create } from "ipfs-http-client";

export const useIpfs = () => {
    const authorization = "Basic " + window.btoa(process.env.NEXT_PUBLIC_IPFS_API_KEY + ":" + process.env.NEXT_PUBLIC_IPFS_API_SECRET);

    const ipfs = create({
        url: "https://ipfs.infura.io:5001/api/v0",
        headers: {
            authorization,
        },
    });

    return ipfs;
}


export const useBoardManager = (library: Web3Provider | undefined) => {
    return library && new Contract(process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT as string, boardManager.abi, library.getSigner())
}

export const usePinManager = (library: Web3Provider | undefined) => {
    return library && new Contract(process.env.NEXT_PUBLIC_PIN_MANAGER_CONTRACT as string, pinManager.abi, library.getSigner())
}
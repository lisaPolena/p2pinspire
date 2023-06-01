import { Contract } from "ethers/lib/ethers";
import { Web3Provider } from '@ethersproject/providers'
import { useMemo } from "react";
import boardManager from '../../contracts/build/BoardManager.json';

export const useBoardManager = (library: Web3Provider | undefined) => {
    return library && new Contract(process.env.NEXT_PUBLIC_BOARD_MANAGER_CONTRACT as string, boardManager.abi, library.getSigner())
}


export interface Board {
    id: number;
    name: string;
    description?: string;
    owner: string;
    pins: Pin[];
    boardCoverHash?: string;
}

export interface Pin {
    id: number;
    title: string;
    description?: string;
    imageHash: string;
    owner: string;
    boardId: number;
}

export interface User {
    userAddress: string;
    name?: string;
    username?: string;
    profileImageHash?: string;
    bio?: string;
    following?: string[];
    followers?: string[];
}

export interface PinOwnerData {
    userAddress: string;
    name?: string;
    username?: string;
    profileImageHash?: string;
}
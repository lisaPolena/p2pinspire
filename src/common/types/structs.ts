

export interface Board {
    id: number;
    name: string;
    description: string;
    owner: string;
    pins: number[];
}

export interface Pin {
    id: number;
    title: string;
    description: string;
    imageHash: string;
    owner: string;
    boardId: number;
}
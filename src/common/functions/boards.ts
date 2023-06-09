import { Board } from "../types/structs";


export function storeBoardsInStorage(boards: Board[]): void {
    const boardsString = JSON.stringify(boards, (key, value) =>
        typeof value === 'bigint'
            ? Number(value)
            : value // return everything else unchanged
    );
    window.sessionStorage.setItem("boards", boardsString);
}

export function getBoardsFromStorage(): Board[] {
    const boards = window.sessionStorage.getItem("boards");
    if (boards) {
        return JSON.parse(boards);
    }
    return [];
}

export function clearBoardStorage(): void {
    window.sessionStorage.setItem("boards", '');
}
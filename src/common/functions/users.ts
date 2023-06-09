import { User } from "../types/structs";

export function storeUserInStorage(user: User): void {
    window.sessionStorage.setItem("user", JSON.stringify(user));
}

export function getUserFromStorage(): User {
    const user = window.sessionStorage.getItem("user");
    if (user) {
        return JSON.parse(user);
    }
    return {} as User;
}

export function clearUserStorage(): void {
    window.sessionStorage.setItem("user", '');
}
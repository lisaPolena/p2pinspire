import { User } from "../types/structs";

export function storeUserInStorage(user: User): void {
    const userString = JSON.stringify(user, (key, value) =>
        typeof value === 'bigint'
            ? Number(value)
            : value // return everything else unchanged
    );
    window.sessionStorage.setItem("user", userString);
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
export const SET_AUTH_IS_FETCHING = "SET_AUTH_IS_FETCHING";
export const SET_AUTH_ERROR = "SET_AUTH_ERROR";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

interface SetAuthIsFetching {
    type: typeof SET_AUTH_IS_FETCHING,
    isFetching: boolean
}

interface SetAuthError {
    type: typeof SET_AUTH_ERROR,
    error: string
}

interface SetCurrentUser {
    type: typeof SET_CURRENT_USER,
    payload: User | null
}

export type AuthAction = SetAuthIsFetching | SetAuthError | SetCurrentUser;

export interface User {
    id: number,
    userName: string,
    firstName: string,
    lastName: string
}

export interface AuthState {
    isFetching: boolean,
    error: string,
    user: User | null
}

export interface LoginData {
    userName: string,
    password: string
}

export interface SignupData {
    firstName: string,
    lastName: string,
    userName: string,
    password: string
}

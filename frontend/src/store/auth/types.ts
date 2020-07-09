export const SET_AUTH_IS_FETCHING = "SET_AUTH_IS_FETCHING";
export const SET_AUTH_ERROR = "SET_AUTH_ERROR";

interface SetAuthIsFetching {
    type: typeof SET_AUTH_IS_FETCHING,
    isFetching: boolean
}

interface SetAuthError {
    type: typeof SET_AUTH_ERROR,
    error: string
}

export type AuthAction = SetAuthIsFetching | SetAuthError;

export interface AuthState {
    isFetching: boolean,
    error: string
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

import { User } from './';

export const FETCH_AUTH_REQUEST = "AUTH_FETCH_REQUEST";
export const FETCH_AUTH_SUCCESS = "AUTH_FETCH_SUCCESS";
export const FETCH_AUTH_FAILURE = "AUTH_FETCH_FAILURE";
export const SET_CURRENT_USER = "SET_CURRENT_USER";

interface FetchAuthRequest {
    type: typeof FETCH_AUTH_REQUEST
}

interface FetchAuthSuccess {
    type: typeof FETCH_AUTH_SUCCESS
}

interface FetchAuthFailure {
    type: typeof FETCH_AUTH_FAILURE,
    error: string
}

interface SetCurrentUser {
    type: typeof SET_CURRENT_USER,
    payload: User | null
}

export type AuthAction = FetchAuthRequest | FetchAuthSuccess | FetchAuthFailure | SetCurrentUser;

export interface AuthState {
    isFetching: boolean,
    error: string | null,
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

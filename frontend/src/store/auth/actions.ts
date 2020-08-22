import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import {
    SET_AUTH_IS_FETCHING,
    SET_AUTH_ERROR,
    SET_CURRENT_USER,
    User,
    AuthAction,
    LoginData,
    SignupData
} from './types';
import { httpRequest } from '../httpRequest';

const setIsFetching = (value: boolean): AuthAction => ({
    type: SET_AUTH_IS_FETCHING,
    isFetching: value
});

const setError = (value: string): AuthAction => ({
    type: SET_AUTH_ERROR,
    error: value
});

export const setCurrentUser = (payload: User | null): AuthAction => ({
    type: SET_CURRENT_USER,
    payload
});

export const login = (data: LoginData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsFetching(true));
        const response = await httpRequest("POST", '/api/login').json(data).send();

        dispatch(setIsFetching(false));
        if (response.ok) {
            const user = await response.json();
            dispatch(setCurrentUser(user));
        } else {
            const errorMessage = response.status === 400 ? "Incorrect username or password" : response.statusText;
            dispatch(setError(errorMessage));
            throw Error(errorMessage);
        }
    }
};

export const loginAs = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await httpRequest("POST", '/api/login/as').send();

        if (response.ok) {
            const user = await response.json();
            dispatch(setCurrentUser(user));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const logout = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await httpRequest("POST", '/api/logout').send();

        if (response.ok) {
            dispatch(setCurrentUser(null));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const signup = (data: SignupData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsFetching(true));
        const response = await httpRequest("POST", '/api/signup').json(data).send();

        dispatch(setIsFetching(false));
        if (!response.ok) {
            const errorMessage = response.status === 400 ? "Username already taken" : response.statusText;
            dispatch(setError(errorMessage));
            throw Error(errorMessage);
        }
    }
};

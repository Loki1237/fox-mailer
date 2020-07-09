import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { SET_AUTH_IS_FETCHING, SET_AUTH_ERROR, AuthAction, LoginData, SignupData } from './types';

export const setAuthIsFetching = (value: boolean): AuthAction => ({
    type: SET_AUTH_IS_FETCHING,
    isFetching: value
});

export const setAuthError = (value: string): AuthAction => ({
    type: SET_AUTH_ERROR,
    error: value
});

export const login = (data: LoginData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setAuthIsFetching(true));

        try {
            const response = await fetch('/api/login', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify(data)
            });

            dispatch(setAuthIsFetching(false));
            if (!response.ok) {
                const errorMessage = response.status === 400 ? "Incorrect username or password" : response.statusText;
                throw Error(errorMessage);
            }
        } catch(e) {
            dispatch(setAuthError(e.message));
            return Promise.reject(e.message);
        }
    }
};

export const signup = (data: SignupData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setAuthIsFetching(true));

        try {
            const response = await fetch('/api/signup', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json;charser=utf-8"
                },
                body: JSON.stringify(data)
            });

            dispatch(setAuthIsFetching(false));
            if (!response.ok) {
                const errorMessage = response.status === 400 ? "Username already taken" : response.statusText;
                throw Error(errorMessage);
            }
        } catch(e) {
            dispatch(setAuthError(e.message));
            return Promise.reject(e.message);
        }
    }
};

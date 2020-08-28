import { AppThunkAction } from '../store/thunk';
import { connect, disconnect } from '@giantmachines/redux-websocket';
import { Dispatch } from 'redux';
import {
    AuthAction,
    LoginData,
    SignupData,
    FETCH_AUTH_REQUEST,
    FETCH_AUTH_SUCCESS,
    FETCH_AUTH_FAILURE,
    SET_CURRENT_USER
} from '../types/authTypes';
import { User } from '../types';
import { httpRequest } from '../middleware/httpRequest';

const fetchRequest = (): AuthAction => ({
    type: FETCH_AUTH_REQUEST
});

const fetchSuccess = (): AuthAction => ({
    type: FETCH_AUTH_SUCCESS
});

const fetchFailure = (error: string): AuthAction => ({
    type: FETCH_AUTH_FAILURE,
    error
});

export const setCurrentUser = (payload: User | null): AuthAction => ({
    type: SET_CURRENT_USER,
    payload
});

export const login = (data: LoginData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchRequest());
        const response = await httpRequest("POST", '/api/login').json(data).send();

        if (response.ok) {
            dispatch(fetchSuccess());
            dispatch(connect('ws://localhost:3000/messages'));

            const user = await response.json();
            dispatch(setCurrentUser(user));
        } else {
            const errorMessage = response.status === 400 ? "Incorrect username or password" : response.statusText;
            dispatch(fetchFailure(errorMessage));
            throw Error(errorMessage);
        }
    }
};

export const loginAs = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await httpRequest("POST", '/api/login/as').send();

        if (response.ok) {
            dispatch(connect('ws://localhost:3000/messages'));

            const user = await response.json();
            dispatch(setCurrentUser(user));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const logout = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await httpRequest("POST", '/api/logout').send();

        if (response.ok) {
            dispatch(setCurrentUser(null));
            dispatch(disconnect());
        } else {
            throw Error(response.statusText);
        }
    }
};

export const signup = (data: SignupData): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchRequest());
        const response = await httpRequest("POST", '/api/signup').json(data).send();

        if (response.ok) {
            dispatch(fetchSuccess());
        } else {
            const errorMessage = response.status === 400 ? "Username already taken" : response.statusText;
            dispatch(fetchFailure(errorMessage));
            throw Error(errorMessage);
        }
    }
};

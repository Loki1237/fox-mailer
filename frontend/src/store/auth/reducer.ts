import {
    AuthState,
    AuthAction,
    SET_AUTH_IS_FETCHING,
    SET_AUTH_ERROR,
    SET_CURRENT_USER
} from './types';

const initialState = {
    isFetching: false,
    error: "",
    user: null
};

export default function(state: AuthState = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case SET_AUTH_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            };

        case SET_AUTH_ERROR:
            return {
                ...state,
                error: action.error
            };

        case SET_CURRENT_USER:
            return {
                ...state,
                user: action.payload
            };

        default:
            return state;
    }
}

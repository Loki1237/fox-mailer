import {
    AuthState,
    AuthAction,
    FETCH_AUTH_REQUEST,
    FETCH_AUTH_SUCCESS,
    FETCH_AUTH_FAILURE,
    SET_CURRENT_USER
} from '../types/authTypes';

const initialState: AuthState = {
    isFetching: false,
    error: null,
    user: null
};

export default function(state = initialState, action: AuthAction): AuthState {
    switch (action.type) {
        case FETCH_AUTH_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null
            };

        case FETCH_AUTH_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null
            }

        case FETCH_AUTH_FAILURE:
            return {
                ...state,
                isFetching: false,
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

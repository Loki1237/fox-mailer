import {
    ContactsState,
    ContactsAction,
    FETCH_CONTACTS_REQUEST,
    FETCH_CONTACTS_SUCCESS,
    FETCH_CONTACTS_FAILURE,
    SET_CONTACT_LIST,
    SET_FOUND_USER_LIST,
    CLEAR_FOUND_USERS,
    CLEAR_CONTACTS,
    RESET_CONTACTS_STATE
} from '../types/contactsTypes';

const initialState: ContactsState = {
    isFetching: false,
    error: null,
    contacts: [],
    foundUsers: []
};

export default function(state = initialState, action: ContactsAction): ContactsState {
    switch (action.type) {
        case FETCH_CONTACTS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null
            };

        case FETCH_CONTACTS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null
            };

        case FETCH_CONTACTS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.error
            };

        case SET_CONTACT_LIST:
            return {
                ...state,
                contacts: action.payload
            };

        case SET_FOUND_USER_LIST:
            return {
                ...state,
                foundUsers: action.payload
            };

        case CLEAR_CONTACTS:
            return {
                ...state,
                contacts: []
            }

        case CLEAR_FOUND_USERS:
            return {
                ...state,
                foundUsers: []
            }

        case RESET_CONTACTS_STATE:
            return initialState;

        default:
            return state;
    }
}

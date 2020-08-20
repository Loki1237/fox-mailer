import {
    ContactsState,
    ContactsAction,
    SET_CONTACTS_IS_FETCHING,
    SET_CONTACTS_ERROR,
    SET_CONTACT_LIST,
    SET_FOUND_USER_LIST,
    CLEAR_FOUND_USERS,
    CLEAR_CONTACTS,
    RESET_CONTACTS_STATE
} from './types';

const initialState = {
    isFetching: false,
    error: "",
    contacts: [],
    foundUsers: []
};

export default function(state: ContactsState = initialState, action: ContactsAction): ContactsState {
    switch (action.type) {
        case SET_CONTACTS_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            };

        case SET_CONTACTS_ERROR:
            return {
                ...state,
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

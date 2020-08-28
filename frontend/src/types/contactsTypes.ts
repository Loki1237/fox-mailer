import { User } from './';

export const FETCH_CONTACTS_REQUEST = "AUTH_FETCH_REQUEST";
export const FETCH_CONTACTS_SUCCESS = "AUTH_FETCH_SUCCESS";
export const FETCH_CONTACTS_FAILURE = "AUTH_FETCH_FAILURE";
export const SET_CONTACT_LIST = "SET_CONTACT_LIST";
export const SET_FOUND_USER_LIST = "SET_FOUND_USER_LIST";
export const RESET_CONTACTS_STATE = "RESET_CONTACTS_STATE";
export const CLEAR_CONTACTS = "CLEAR_CONTACTS";
export const CLEAR_FOUND_USERS = "CLEAR_FOUND_USERS";

interface FetchContactsRequest {
    type: typeof FETCH_CONTACTS_REQUEST
}

interface FetchContactsSuccess {
    type: typeof FETCH_CONTACTS_SUCCESS
}

interface FetchContactsFailure {
    type: typeof FETCH_CONTACTS_FAILURE,
    error: string
}

interface SetContactList {
    type: typeof SET_CONTACT_LIST,
    payload: User[]
}

interface SetFindedUserList {
    type: typeof SET_FOUND_USER_LIST,
    payload: User[]
}

interface ClearContacts {
    type: typeof CLEAR_CONTACTS
}

interface ClearFoundUsers {
    type: typeof CLEAR_FOUND_USERS
}

interface ResetState {
    type: typeof RESET_CONTACTS_STATE
}

export type ContactsAction = FetchContactsRequest
                           | FetchContactsSuccess
                           | FetchContactsFailure
                           | SetContactList
                           | SetFindedUserList
                           | ClearContacts
                           | ClearFoundUsers
                           | ResetState;

export interface ContactsState {
    isFetching: boolean,
    error: string | null,
    contacts: User[],
    foundUsers: User[]
}

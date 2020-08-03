export const SET_CONTACTS_IS_FETCHING = "SET_AUTH_IS_FETCHING";
export const SET_CONTACTS_ERROR = "SET_AUTH_ERROR";
export const SET_CONTACT_LIST = "SET_CONTACT_LIST";
export const SET_FOUND_USER_LIST = "SET_FOUND_USER_LIST";
export const RESET_CONTACTS_STATE = "RESET_CONTACTS_STATE";
export const CLEAR_CONTACTS = "CLEAR_CONTACTS";
export const CLEAR_FOUND_USERS = "CLEAR_FOUND_USERS";

interface SetContactsIsFetching {
    type: typeof SET_CONTACTS_IS_FETCHING,
    isFetching: boolean
}

interface SetContactsError {
    type: typeof SET_CONTACTS_ERROR,
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

export type ContactsAction = SetContactsIsFetching
                             | SetContactsError
                             | SetContactList
                             | SetFindedUserList
                             | ClearContacts
                             | ClearFoundUsers
                             | ResetState;

export interface User {
    id: number,
    userName: string,
    firstName: string,
    lastName: string,
    inContacts?: boolean
}

export interface ContactsState {
    isFetching: boolean,
    error: string,
    contacts: User[],
    foundUsers: User[]
}

import { AppThunkAction } from '../thunk';
import { Dispatch } from 'redux';
import { RootState } from '../index';
import {
    ContactsAction,
    User,
    SET_CONTACTS_IS_FETCHING,
    SET_CONTACTS_ERROR,
    SET_CONTACT_LIST,
    SET_FOUND_USER_LIST,
    CLEAR_CONTACTS,
    CLEAR_FOUND_USERS,
    RESET_CONTACTS_STATE
} from './types';
import _ from 'lodash';

const setIsFetching = (value: boolean): ContactsAction => ({
    type: SET_CONTACTS_IS_FETCHING,
    isFetching: value
});

const setError = (value: string): ContactsAction => ({
    type: SET_CONTACTS_ERROR,
    error: value
});

const setContactList = (payload: User[]): ContactsAction => ({
    type: SET_CONTACT_LIST,
    payload
});

const setFoundUserList = (payload: User[]): ContactsAction => ({
    type: SET_FOUND_USER_LIST,
    payload
});

const clearContacts = (): ContactsAction => ({
    type: CLEAR_CONTACTS
});

export const clearFoundUsers = (): ContactsAction => ({
    type: CLEAR_FOUND_USERS
});

export const resetState = (): ContactsAction => ({
    type: RESET_CONTACTS_STATE
});

export const findContacts = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsFetching(true));
        const response = await fetch('/api/contacts');

        dispatch(setIsFetching(false));
        if (response.ok) {
            const contacts = await response.json();
            dispatch(setContactList(contacts));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const findUsers = (string: string, event: "buttonClick" | "listScroll"): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(setIsFetching(true));

        const state = getState().contacts;
        const skipCount = event === "listScroll" ? state.foundUsers.length : 0;

        const response = await fetch('/api/users/search', {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ string, skipCount })
        });

        dispatch(setIsFetching(false));
        if (response.ok) {
            const newFoundUsers = await response.json();
            for (let user of newFoundUsers) {
                user.inContacts = _.findIndex(state.contacts, { id: user.id }) >= 0;
            }

            dispatch(clearFoundUsers());
            if (event === "listScroll") {
                dispatch(setFoundUserList([...state.foundUsers, ...newFoundUsers]));
            } else {
                dispatch(setFoundUserList(newFoundUsers));
            }
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const addContact = (id: number, index: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await fetch(`/api/contacts/add/${id}`, { method: "PUT" });

        if (response.ok) {
            const state = getState().contacts;

            const newContact = await response.json();
            state.contacts.push(newContact);
            state.contacts.sort((prevUser: User, nextUser: User) => {
                if (prevUser.firstName > nextUser.firstName) return 1;
                if (prevUser.firstName < nextUser.firstName) return -1;
                return 0;
            });

            const user = state.foundUsers[index];
            user.inContacts = true;

            dispatch(setContactList(state.contacts));
            dispatch(clearFoundUsers());
            dispatch(setFoundUserList(state.foundUsers));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const deleteContact = (id: number, index: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await fetch(`/api/contacts/delete/${id}`, { method: "DELETE" });

        if (response.ok) {
            const contacts = getState().contacts.contacts;
            contacts.splice(index, 1);

            dispatch(clearContacts());
            dispatch(setContactList(contacts));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

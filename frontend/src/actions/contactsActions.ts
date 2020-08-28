import { AppThunkAction } from '../store/thunk';
import { Dispatch } from 'redux';
import { RootState } from '../store';
import {
    ContactsAction,
    FETCH_CONTACTS_REQUEST,
    FETCH_CONTACTS_SUCCESS,
    FETCH_CONTACTS_FAILURE,
    SET_CONTACT_LIST,
    SET_FOUND_USER_LIST,
    CLEAR_CONTACTS,
    CLEAR_FOUND_USERS,
    RESET_CONTACTS_STATE
} from '../types/contactsTypes';
import { User } from '../types';
import _ from 'lodash';
import { httpRequest } from '../middleware/httpRequest';

const fetchRequest = (): ContactsAction => ({
    type: FETCH_CONTACTS_REQUEST
});

const fetchSuccess = (): ContactsAction => ({
    type: FETCH_CONTACTS_SUCCESS
});

const fetchFailure = (error: string): ContactsAction => ({
    type: FETCH_CONTACTS_FAILURE,
    error
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
        dispatch(fetchRequest());
        const response = await httpRequest("GET", '/api/contacts').send();

        if (response.ok) {
            dispatch(fetchSuccess());

            const contacts = await response.json();
            dispatch(setContactList(contacts));
        } else {
            dispatch(fetchFailure(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const findUsers = (string: string, event: "buttonClick" | "listScroll"): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        dispatch(fetchRequest());

        const state = getState().contacts;
        const skipCount = event === "listScroll" ? state.foundUsers.length : 0;

        const response = await httpRequest("POST", '/api/users/search').json({ string, skipCount }).send();

        if (response.ok) {
            dispatch(fetchSuccess());

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
            dispatch(fetchFailure(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const addContact = (id: number, index: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await httpRequest("PUT", `/api/contacts/add/${id}`).send();

        if (response.ok) {
            const state = getState().contacts;
            const contacts = [...state.contacts];
            const foundUsers = [...state.foundUsers];

            const newContact = await response.json();
            contacts.push(newContact);
            contacts.sort((prevUser: User, nextUser: User) => {
                if (prevUser.firstName > nextUser.firstName) return 1;
                if (prevUser.firstName < nextUser.firstName) return -1;
                return 0;
            });

            const user = foundUsers[index];
            user.inContacts = true;

            dispatch(setContactList(contacts));
            dispatch(clearFoundUsers());
            dispatch(setFoundUserList(foundUsers));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const deleteContact = (id: number, index: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await httpRequest("DELETE", `/api/contacts/delete/${id}`).send();

        if (response.ok) {
            const contacts = [...getState().contacts.contacts];
            contacts.splice(index, 1);

            dispatch(clearContacts());
            dispatch(setContactList(contacts));
        } else {
            throw Error(response.statusText);
        }
    }
};

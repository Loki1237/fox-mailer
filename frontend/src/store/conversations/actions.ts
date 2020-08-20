import { AppThunkAction, AppThunkDispatch } from '../thunk';
import { Dispatch } from 'redux';
import { RootState } from '../index';
import {
    ConversationsAction,
    Conversation,
    User,
    Message,
    SET_CONVERSATIONS_IS_FETCHING,
    SET_CONVERSATIONS_ERROR,
    SET_CONVERSATION_LIST,
    SET_CURRENT_CONVERSATION,
    ADD_MESSAGE_IN_CURRENT_CONVERSATION,
    RESET_CURRENT_CONVERSATION
} from './types';
import _ from 'lodash';

const setIsFetching = (value: boolean): ConversationsAction => ({
    type: SET_CONVERSATIONS_IS_FETCHING,
    isFetching: value
});

const setError = (value: string): ConversationsAction => ({
    type: SET_CONVERSATIONS_ERROR,
    error: value
});

const setConversationList = (payload: Conversation[]): ConversationsAction => ({
    type: SET_CONVERSATION_LIST,
    payload
});

const setCurrentConversation = (payload: Conversation): ConversationsAction => ({
    type: SET_CURRENT_CONVERSATION,
    payload
});

export const addMessageInCurrentConversation = (payload: Message): ConversationsAction => ({
    type: ADD_MESSAGE_IN_CURRENT_CONVERSATION,
    payload
});

export const resetCurrentConversation = (): ConversationsAction => ({
    type: RESET_CURRENT_CONVERSATION
});

export const getConversations = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(setIsFetching(true));
        const response = await fetch('/api/conversations/get/all');

        dispatch(setIsFetching(false));
        if (response.ok) {
            const conversations = await response.json();
            dispatch(setConversationList(conversations));
        } else {
            dispatch(setError(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const selectConversation = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const response = await fetch(`/api/conversations/get/one/${id}`);

        if (response.ok) {
            const conversation = await response.json();
            dispatch(setCurrentConversation(conversation));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const checkDialogToExistence = (user: User): AppThunkAction<Promise<number | null>> => {
    return async () => {
        const response = await fetch(`/api/conversations/check/dialog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ interlocutorId: user.id })
        });

        switch (response.status) {
            case 200:
                const dialog = await response.json();
                return dialog.id;

            case 204:
                return null;

            default:
                throw Error(response.statusText);
        }
    }
};

export const setLastMessageInConversation = (conversationId: number, message: Message): AppThunkAction => {
    return (dispatch: Dispatch, getState: () => RootState) => {
        const conversations = getState().conversations.conversations;
        const index = _.findIndex(conversations, { id: conversationId });

        if (index >= 0) {
            const [changingConversation] = conversations.splice(index, 1);
            changingConversation.messages = [message];

            dispatch(setConversationList([changingConversation, ...conversations]));
        }
    }
};

export const createVoidDialog = (user: User): AppThunkAction => {
    return (dispatch: AppThunkDispatch) => {
        const newDialog: Conversation = {
            id: 0,
            type: "newDialog",
            name: `${user.firstName} ${user.lastName}`,
            creatorId: 0,
            participants: [user],
            messages: []
        };
        dispatch(setCurrentConversation(newDialog));
    }
};

export const createDialog = (interlocutorId: number): AppThunkAction<Promise<number>> => {
    return async (dispatch: AppThunkDispatch, getState: () => RootState) => {
        const response = await fetch(`/api/conversations/create/dialog`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ interlocutorId })
        });

        if (response.ok) {
            const conversations = getState().conversations.conversations;
            const newConversation = await response.json();
            dispatch(setConversationList([newConversation, ...conversations]));
            return newConversation.id;
        } else {
            throw Error(response.statusText);
        }
    }
};

export const createChat = (name: string, userIds: number[]): AppThunkAction<Promise<number>> => {
    return async (dispatch: AppThunkDispatch, getState: () => RootState) => {
        const response = await fetch(`/api/conversations/create/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8"
            },
            body: JSON.stringify({ name, userIds })
        });

        if (response.ok) {
            const conversations = getState().conversations.conversations;
            const newConversation = await response.json();
            dispatch(setConversationList([newConversation, ...conversations]));
            return newConversation.id;
        } else {
            throw Error(response.statusText);
        }
    }
};

export const deleteConversation = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await fetch(`/api/conversations/delete/${id}`, { method: "DELETE", });

        if (response.ok) {
            const state = getState().conversations;
            const index = _.findIndex(state.conversations, { id });

            if (state.currentConversation && state.currentConversation.id === id) {
                dispatch(resetCurrentConversation());
            }

            if (index >= 0) {
                state.conversations.splice(index, 1);
                dispatch(setConversationList(state.conversations));
            }
        } else {
            throw Error(response.statusText);
        }
    }
};

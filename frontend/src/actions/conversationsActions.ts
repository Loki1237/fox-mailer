import { AppThunkAction, AppThunkDispatch } from '../store/thunk';
import { Dispatch } from 'redux';
import { RootState } from '../store';
import {
    ConversationsAction,
    Conversation,
    Message,
    FETCH_CONVERSATIONS_REQUEST,
    FETCH_CONVERSATIONS_SUCCESS,
    FETCH_CONVERSATIONS_FAILURE,
    SET_CONVERSATION_LIST,
    SET_CURRENT_CONVERSATION,
    SET_CURRENT_MESSAGE_LIST,
    SET_PARTICIPANTS_OF_CURRENT_CONVERSATION,
    CREATE_VOID_DIALOG,
    RESET_CURRENT_CONVERSATION
} from '../types/conversationsTypes';
import { User } from '../types';
import { WsOutgoingTextMessage } from '../types/webSocketTypes';
import { send } from '@giantmachines/redux-websocket';
import { httpRequest } from '../middleware/httpRequest';
import _ from 'lodash';

const fetchRequest = (): ConversationsAction => ({
    type: FETCH_CONVERSATIONS_REQUEST
});

const fetchSuccess = (): ConversationsAction => ({
    type: FETCH_CONVERSATIONS_SUCCESS
});

const fetchFailure = (error: string): ConversationsAction => ({
    type: FETCH_CONVERSATIONS_FAILURE,
    error
});

const setConversationList = (payload: Conversation[]): ConversationsAction => ({
    type: SET_CONVERSATION_LIST,
    payload
});

const setCurrentConversation = (payload: Conversation): ConversationsAction => ({
    type: SET_CURRENT_CONVERSATION,
    payload
});

const setCurrentMessageList = (payload: Message[]): ConversationsAction => ({
    type: SET_CURRENT_MESSAGE_LIST,
    payload
});

const setParticipantsOfCurrentConversation = (payload: User[]): ConversationsAction => ( {
    type: SET_PARTICIPANTS_OF_CURRENT_CONVERSATION,
    payload
});

const createVoidDialog = (payload: User): ConversationsAction => ({
    type: CREATE_VOID_DIALOG,
    payload
});

export const resetCurrentConversation = (): ConversationsAction => ({
    type: RESET_CURRENT_CONVERSATION
});

export const getConversations = (): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        dispatch(fetchRequest());
        const response = await httpRequest("GET", '/api/conversations/get/all').send();

        if (response.ok) {
            dispatch(fetchSuccess());

            const conversations = await response.json();
            dispatch(setConversationList(conversations));
        } else {
            dispatch(fetchFailure(response.statusText));
            throw Error(response.statusText);
        }
    }
};

export const getMessages = (): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const currentConversation = getState().conversations.currentConversation;
        if (!currentConversation) throw Error("Conversation is not selected");

        const response = await httpRequest("POST", '/api/messages/get/many')
            .json({ conversationId: currentConversation.id, skip: currentConversation.messages.length })
            .send();

        if (response.ok) {
            const messages = await response.json();
            dispatch(setCurrentMessageList([...currentConversation.messages, ...messages]));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const selectConversation = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch) => {
        const conversationResponse = await httpRequest("GET", `/api/conversations/get/one/${id}`).send();

        if (conversationResponse.ok) {
            const conversation = await conversationResponse.json();
            dispatch(setCurrentConversation(conversation));

            const messagesResponse = await httpRequest("POST", '/api/messages/get/many')
                .json({ conversationId: conversation.id })
                .send();

            if (messagesResponse.ok) {
                const messages = await messagesResponse.json();
                dispatch(setCurrentMessageList(messages));
            } else {
                throw Error(messagesResponse.statusText);
            }
        } else {
            throw Error(conversationResponse.statusText);
        }
    }
};

export const selectDialogOrCreateNew = (user: User): AppThunkAction => {
    return async (dispatch: AppThunkDispatch) => {
        const response = await httpRequest("POST", '/api/conversations/check/dialog')
            .json({ interlocutorId: user.id })
            .send();

        if (response.ok) {
            switch (response.status) {
                case 200:
                    const dialog = await response.json();
                    dispatch(selectConversation(dialog.id));
                    break;

                case 204:
                    dispatch(createVoidDialog(user));
                    break;
            }
        } else {
            throw Error(response.statusText);
        }
    }
};

export const createDialogAndSelect = (interlocutorId: number, firstMessageText: string): AppThunkAction => {
    return async (dispatch: AppThunkDispatch, getState: () => RootState) => {
        const response = await httpRequest("POST", `/api/conversations/create/dialog`)
            .json({ interlocutorId, firstMessage: firstMessageText })
            .send();

        if (response.ok) {
            const newConversation = await response.json();
            dispatch(selectConversation(newConversation.id));

            const conversations = getState().conversations.conversations;
            dispatch(setConversationList([newConversation, ...conversations]));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const createChatAndSelect = (name: string, userIds: number[]): AppThunkAction => {
    return async (dispatch: AppThunkDispatch, getState: () => RootState) => {
        const response = await httpRequest("POST", '/api/conversations/create/chat').json({ name, userIds }).send();

        if (response.ok) {
            const newConversation = await response.json();
            dispatch(selectConversation(newConversation.id));

            const conversations = getState().conversations.conversations;
            dispatch(setConversationList([newConversation, ...conversations]));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const addUsersToCurrentChat = (userIds: number[]): AppThunkAction => {
    return async (dispatch: AppThunkDispatch, getState: () => RootState) => {
        const currentConversationId = getState().conversations.currentConversation?.id || 0;
        const response = await httpRequest("PUT", '/api/conversations/change/chat/participants/add/many')
            .json({ chatId: currentConversationId, userIds })
            .send();

        if (response.ok) {
            const changedConversation = await response.json();
            dispatch(setParticipantsOfCurrentConversation(changedConversation.participants));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const deleteUserFromChat = (chatId: number, userId: number): AppThunkAction => {
    return async (dispatch: AppThunkDispatch) => {
        const response = await httpRequest("PUT", '/api/conversations/change/chat/participants/delete/one')
            .json({ chatId, participantId: userId })
            .send();

        if (response.ok) {
            const changedConversation = await response.json();
            dispatch(setParticipantsOfCurrentConversation(changedConversation.participants));
        } else {
            throw Error(response.statusText);
        }
    }
};

export const deleteConversation = (id: number): AppThunkAction => {
    return async (dispatch: Dispatch, getState: () => RootState) => {
        const response = await httpRequest("DELETE", `/api/conversations/delete/${id}`).send();

        if (response.ok) {
            const state = getState().conversations;
            const index = _.findIndex(state.conversations, { id });

            if (state.currentConversation?.id === id) {
                dispatch(resetCurrentConversation());
            }

            if (index >= 0) {
                const conversations = [...state.conversations];
                conversations.splice(index, 1);
                dispatch(setConversationList(conversations));
            }
        } else {
            throw Error(response.statusText);
        }
    }
};

export const sendWebSocketMessage = (conversationId: number, text: string): AppThunkAction => {
    return async (dispatch: AppThunkDispatch) => {
        const newMessage: WsOutgoingTextMessage = { conversationId, text };

        dispatch(send(newMessage));
    }
};

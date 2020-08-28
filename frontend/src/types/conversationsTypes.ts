import { User } from './';

export const FETCH_CONVERSATIONS_REQUEST = "FETCH_CONVERSATIONS_REQUEST";
export const FETCH_CONVERSATIONS_SUCCESS = "FETCH_CONVERSATIONS_SUCCESS";
export const FETCH_CONVERSATIONS_FAILURE = "FETCH_CONVERSATIONS_FAILURE";
export const SET_CONVERSATION_LIST = "SET_CONVERSATION_LIST";
export const SET_CURRENT_CONVERSATION = "SET_CURRENT_CONVERSATION";
export const SET_CURRENT_MESSAGE_LIST = "SET_CURRENT_MESSAGE_LIST";
export const CREATE_VOID_DIALOG = "CREATE_VOID_DIALOG";
export const RESET_CURRENT_CONVERSATION = "RESET_CURRENT_CONVERSATION";
export const WEB_SOCKET_MESSAGE = "REDUX_WEBSOCKET::MESSAGE";

interface FetchConversationsRequest {
    type: typeof FETCH_CONVERSATIONS_REQUEST
}

interface FetchConversationsSuccess {
    type: typeof FETCH_CONVERSATIONS_SUCCESS
}

interface FetchConversationsFailure {
    type: typeof FETCH_CONVERSATIONS_FAILURE,
    error: string
}

interface SetConversationList {
    type: typeof SET_CONVERSATION_LIST,
    payload: Conversation[]
}

interface SetCurrentConversation {
    type: typeof SET_CURRENT_CONVERSATION,
    payload: Conversation
}

interface SetCurrentMessageList {
    type: typeof SET_CURRENT_MESSAGE_LIST,
    payload: Message[]
}

interface CreateVoidDialog {
    type: typeof CREATE_VOID_DIALOG,
    payload: User
}

interface ResetCurrentConversation {
    type: typeof RESET_CURRENT_CONVERSATION
}

interface WebSocketOnMessage {
    type: typeof WEB_SOCKET_MESSAGE,
    meta: {
        timestamp: Date,
    },
    payload: {
        message: string,
        origin: string,
    }
}

export type ConversationsAction = FetchConversationsRequest
                                | FetchConversationsSuccess
                                | FetchConversationsFailure
                                | SetConversationList
                                | SetCurrentConversation
                                | SetCurrentMessageList
                                | CreateVoidDialog
                                | ResetCurrentConversation
                                | WebSocketOnMessage;

export interface Message {
    id: number,
    authorId: number,
    conversationId: number,
    text: string,
    createdAt: string
}

export interface Conversation {
    id: number,
    type: "dialog" | "chat" | "newDialog",
    name: string,
    creatorId: number,
    participants: User[],
    messages: Message[]
}

export interface ConversationsState {
    isFetching: boolean,
    error: string | null,
    conversations: Conversation[],
    currentConversation: Conversation | null
}

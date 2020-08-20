export const SET_CONVERSATIONS_IS_FETCHING = "SET_CONVERSATIONS_IS_FETCHING";
export const SET_CONVERSATIONS_ERROR = "SET_CONVERSATIONS_ERROR";
export const SET_CONVERSATION_LIST = "SET_CONVERSATION_LIST";
export const SET_CURRENT_CONVERSATION = "SET_CURRENT_CONVERSATION";
export const ADD_MESSAGE_IN_CURRENT_CONVERSATION = "ADD_MESSAGE_IN_CURRENT_CONVERSATION";
export const RESET_CURRENT_CONVERSATION = "RESET_CURRENT_CONVERSATION";

interface SetConversationsIsFetching {
    type: typeof SET_CONVERSATIONS_IS_FETCHING,
    isFetching: boolean
}

interface SetConversationsError {
    type: typeof SET_CONVERSATIONS_ERROR,
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

interface AddMessageInCurrentConversation {
    type: typeof ADD_MESSAGE_IN_CURRENT_CONVERSATION,
    payload: Message
}

interface ResetCurrentConversation {
    type: typeof RESET_CURRENT_CONVERSATION
}

export type ConversationsAction = SetConversationsIsFetching
                                  | SetConversationsError
                                  | SetConversationList
                                  | SetCurrentConversation
                                  | AddMessageInCurrentConversation
                                  | ResetCurrentConversation;

export interface User {
    id: number,
    userName: string,
    firstName: string,
    lastName: string
}

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
    error: string,
    conversations: Conversation[],
    currentConversation: Conversation | null
}

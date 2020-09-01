import { Message, Conversation } from './conversationsTypes';

export enum WsMessageTypes {
    TEXT_MESSAGE = "TEXT_MESSAGE",
    CREATE_CONVERSATION = "CREATE_CONVERSATION",
    CHANGE_CONVERSATION = "CHANGE_CONVERSATION",
    DELETE_CONVERSATION = "DELETE_CONVERSATION"
}

interface WebSocketMessage {
    type: WsMessageTypes
}

export interface WsIncomingTextMessage extends WebSocketMessage {
    type: WsMessageTypes.TEXT_MESSAGE,
    content: Message
}

export interface WsConversationActionMessage extends WebSocketMessage {
    type: WsMessageTypes.CREATE_CONVERSATION | WsMessageTypes.CHANGE_CONVERSATION | WsMessageTypes.DELETE_CONVERSATION
    content: Conversation
}

export type WsIncomingMessage = WsIncomingTextMessage | WsConversationActionMessage;

export interface WsOutgoingTextMessage {
    conversationId: number,
    text: string
}

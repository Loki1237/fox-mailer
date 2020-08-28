import { Message, Conversation } from './conversationsTypes';

export interface WebSocketState {
    connected: boolean,
    message: WsIncomingMessage
}

interface WebSocketMessage {
    type: "text" | "action"
}

export interface WsIncomingTextMessage extends WebSocketMessage {
    type: "text",
    content: Message
}

export interface WsOutgoingTextMessage extends WebSocketMessage {
    type: "text",
    content: {
        conversationId: number,
        text: string
    }
}

export interface WsActionMessage extends WebSocketMessage {
    type: "action",
    content: {
        action: "create_conversation" | "delete_conversation",
        data: Conversation
    }
}

export type WsIncomingMessage = WsIncomingTextMessage | WsActionMessage;

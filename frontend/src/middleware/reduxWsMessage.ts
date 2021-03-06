import { Middleware } from 'redux';
import { WsIncomingMessage, WsMessageTypes } from '../types/webSocketTypes';
import { Conversation, WEB_SOCKET_MESSAGE } from '../types/conversationsTypes';
import { RootState } from '../store';
import { toast as notify } from 'react-toastify';
import messageSound from '../assets/sounds/message.mp3';

const messageSoundNotification = new Audio(messageSound);

const reduxWebSocketMessageMiddleware: Middleware<any, RootState> = store => next => action => {
    if (action.type === WEB_SOCKET_MESSAGE) {
        const state = store.getState();
        const message: WsIncomingMessage = JSON.parse(action.payload.message);

        if (message.type === WsMessageTypes.TEXT_MESSAGE) {
            const currentConversation = state.conversations.currentConversation;
            const isIncomingMessage = message.content.authorId !== state.auth.user?.id;
            const messageForCurrentConversation = message.content.conversationId === currentConversation?.id;

            if (isIncomingMessage && !messageForCurrentConversation) {
                notify.info(`Message: ${message.content.text}`);
                messageSoundNotification.play();
            }
        }

        if (message.type === WsMessageTypes.CREATE_CONVERSATION) {
            if (message.content.creatorId !== state.auth.user?.id) {
                messageSoundNotification.play();
                const newConversation: Conversation = message.content;

                if (newConversation.type === "dialog") {
                    notify.info(`Message: ${newConversation.messages[0].text}`);
                } else {
                    notify.info(`You were added to the chat: ${newConversation.name}`);
                }
            }
        }
    }

    return next(action);
};

export default reduxWebSocketMessageMiddleware;

import {
    Conversation,
    ConversationsState,
    ConversationsAction,
    FETCH_CONVERSATIONS_REQUEST,
    FETCH_CONVERSATIONS_SUCCESS,
    FETCH_CONVERSATIONS_FAILURE,
    SET_CONVERSATION_LIST,
    SET_CURRENT_CONVERSATION,
    SET_CURRENT_MESSAGE_LIST,
    SET_PARTICIPANTS_OF_CURRENT_CONVERSATION,
    CREATE_VOID_DIALOG,
    RESET_CURRENT_CONVERSATION,
    WEB_SOCKET_MESSAGE
} from '../types/conversationsTypes';
import { WsMessageTypes, WsIncomingMessage } from '../types/webSocketTypes';
import _ from 'lodash';

const initialState: ConversationsState = {
    isFetching: false,
    error: "",
    conversations: [],
    currentConversation: null
};

export default function(state = initialState, action: ConversationsAction): ConversationsState {
    switch (action.type) {
        case FETCH_CONVERSATIONS_REQUEST:
            return {
                ...state,
                isFetching: true,
                error: null
            };

        case FETCH_CONVERSATIONS_SUCCESS:
            return {
                ...state,
                isFetching: false,
                error: null
            };

        case FETCH_CONVERSATIONS_FAILURE:
            return {
                ...state,
                isFetching: false,
                error: action.error
            };

        case SET_CONVERSATION_LIST:
            return {
                ...state,
                conversations: action.payload
            };

        case SET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversation: action.payload
            };

        case SET_CURRENT_MESSAGE_LIST:
            if (state.currentConversation) {
                return {
                    ...state,
                    currentConversation: {
                        ...state.currentConversation,
                        messages: action.payload
                    }
                }
            } else {
                return state;
            }

        case SET_PARTICIPANTS_OF_CURRENT_CONVERSATION:
            if (state.currentConversation) {
                return {
                    ...state,
                    currentConversation: {
                        ...state.currentConversation,
                        participants: action.payload
                    }
                }
            } else {
                return state;
            }

        case CREATE_VOID_DIALOG: {
            const user = action.payload;
            return {
                ...state,
                currentConversation: {
                    id: 0,
                    type: "newDialog",
                    name: `${user.firstName} ${user.lastName}`,
                    creatorId: 0,
                    participants: [user],
                    messages: []
                }
            }
        }

        case RESET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversation: initialState.currentConversation
            };

        case WEB_SOCKET_MESSAGE: {
            const message: WsIncomingMessage = JSON.parse(action.payload.message);
            const newState = { ...state };
            console.log(message);

            switch (message.type) {
                case WsMessageTypes.TEXT_MESSAGE: {
                    const index = _.findIndex(newState.conversations, { id: message.content.conversationId });
                    if (index >= 0) {
                        const [changingConversation] = newState.conversations.splice(index, 1);
                        changingConversation.messages = [message.content];
                        newState.conversations = [changingConversation, ...newState.conversations];
                    }

                    if (message.content.conversationId === newState.currentConversation?.id) {
                        newState.currentConversation.messages = [
                            message.content,
                            ...newState.currentConversation.messages
                        ];
                    }
                    break;
                }

                case WsMessageTypes.DELETE_CONVERSATION: {
                    const deletedConversation: Conversation = message.content;
                    const index = _.findIndex(newState.conversations, { id: deletedConversation.id });

                    if (index >= 0) {
                        newState.conversations.splice(index, 1);
                    }
                    if (deletedConversation.id === newState.currentConversation?.id) {
                        newState.currentConversation = null;
                    }
                    break;
                }
            }

            return newState;
        }

        default:
            return state;
    }
}

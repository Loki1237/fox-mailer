import {
    ConversationsState,
    ConversationsAction,
    SET_CONVERSATIONS_IS_FETCHING,
    SET_CONVERSATIONS_ERROR,
    SET_CONVERSATION_LIST,
    SET_CURRENT_CONVERSATION,
    ADD_MESSAGE_IN_CURRENT_CONVERSATION,
    RESET_CURRENT_CONVERSATION
} from './types';

const initialState = {
    isFetching: false,
    error: "",
    conversations: [],
    currentConversation: null
};

export default function(state: ConversationsState = initialState, action: ConversationsAction): ConversationsState {
    switch (action.type) {
        case SET_CONVERSATIONS_IS_FETCHING:
            return {
                ...state,
                isFetching: action.isFetching
            };

        case SET_CONVERSATIONS_ERROR:
            return {
                ...state,
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

        case ADD_MESSAGE_IN_CURRENT_CONVERSATION: {
            if (state.currentConversation) {
                return {
                    ...state,
                    currentConversation: {
                        ...state.currentConversation,
                        messages: [action.payload, ...state.currentConversation.messages]
                    }
                }
            } else {
                return state;
            }
        }

        case RESET_CURRENT_CONVERSATION:
            return {
                ...state,
                currentConversation: initialState.currentConversation
            };

        default:
            return state;
    }
}

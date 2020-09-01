import { connect } from 'react-redux';
import {
    resetCurrentConversation,
    createDialogAndSelect,
    getMessages,
    sendWebSocketMessage
} from '../actions/conversationsActions';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import Messages from '../components/Messages/Messages';

const mapStateToProps = (state: RootState) => ({
    isFetching: state.conversations.isFetching,
    error: state.conversations.error,
    conversations: state.conversations.conversations,
    currentConversation: state.conversations.currentConversation,
    currentUser: state.auth.user
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    resetCurrentConversation: () => dispatch(resetCurrentConversation()),
    createDialogAndSelect: (interlocutorId: number, firstMessageText: string) => dispatch(createDialogAndSelect(interlocutorId, firstMessageText)),
    getMessages: () => dispatch(getMessages()),
    sendWebSocketMessage: (conversationId: number, text: string) => dispatch(sendWebSocketMessage(conversationId, text))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

import { connect } from 'react-redux';
import { getConversations, selectConversation, deleteConversation } from '../actions/conversationsActions';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import Conversations from '../components/Conversations/Conversations';

const mapStateToProps = (state: RootState) => ({
    screenMode: state.app.screenMode,
    isFetching: state.conversations.isFetching,
    error: state.conversations.error,
    conversations: state.conversations.conversations,
    currentConversation: state.conversations.currentConversation
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    getConversations: () => dispatch(getConversations()),
    selectConversation: (id: number) => dispatch(selectConversation(id)),
    deleteConversation: (id: number) => dispatch(deleteConversation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);

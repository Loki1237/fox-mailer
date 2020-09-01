import { connect } from 'react-redux';
import { findContacts, resetState, } from '../actions/contactsActions';
import { addUsersToCurrentChat, deleteUserFromChat } from '../actions/conversationsActions';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import ManagingChat from '../components/ManagingChat/ManagingChat';

const mapStateToProps = (state: RootState) => ({
    isFetching: state.contacts.isFetching,
    error: state.contacts.error,
    currentUser: state.auth.user,
    contacts: state.contacts.contacts,
    currentConversation: state.conversations.currentConversation
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    findContacts: () => dispatch(findContacts()),
    resetContacts: () => dispatch(resetState()),
    addUsersToCurrentChat: (userIds: number[]) => dispatch(addUsersToCurrentChat(userIds)),
    deleteUserFromChat: (chatId: number, userId: number) => dispatch(deleteUserFromChat(chatId, userId))
});

export default connect(mapStateToProps, mapDispatchToProps)(ManagingChat);

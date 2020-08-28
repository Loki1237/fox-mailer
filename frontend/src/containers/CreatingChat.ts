import { connect } from 'react-redux';
import { findContacts, resetState, } from '../actions/contactsActions';
import { createChatAndSelect } from '../actions/conversationsActions';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import CreatingChat from '../components/CreatingChat/CreatingChat';

const mapStateToProps = (state: RootState) => ({
    isFetching: state.contacts.isFetching,
    error: state.contacts.error,
    contacts: state.contacts.contacts
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    findContacts: () => dispatch(findContacts()),
    resetContactsState: () => dispatch(resetState()),
    createChatAndSelect: (name: string, userIds: number[]) => dispatch(createChatAndSelect(name, userIds))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatingChat);

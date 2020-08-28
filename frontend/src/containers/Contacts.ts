import { connect } from 'react-redux';
import { User } from '../types';
import {
    findContacts,
    findUsers,
    resetState,
    addContact,
    deleteContact,
    clearFoundUsers
} from '../actions/contactsActions';
import { selectDialogOrCreateNew } from '../actions/conversationsActions';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import Contacts from '../components/Contacts/Contacts';

const mapStateToProps = (state: RootState) => ({
    isFetching: state.contacts.isFetching,
    error: state.contacts.error,
    contacts: state.contacts.contacts,
    foundUsers: state.contacts.foundUsers
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    findContacts: () => dispatch(findContacts()),
    findUsers: (string: string, event: "buttonClick" | "listScroll") => dispatch(findUsers(string, event)),
    clearFoundUsers: () => dispatch(clearFoundUsers()),
    resetState: () => dispatch(resetState()),
    addContact: (id: number, index: number) => dispatch(addContact(id, index)),
    deleteContact: (id: number, index: number) => dispatch(deleteContact(id, index)),
    selectDialogOrCreateNew: (user: User) => dispatch(selectDialogOrCreateNew(user))
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

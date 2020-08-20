import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    List,
    Tooltip
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

import { connect } from 'react-redux';
import { User } from '../../store/contacts/types';
import {
    findContacts,
    findUsers,
    resetState,
    addContact,
    deleteContact,
    clearFoundUsers
} from '../../store/contacts/actions';
import {
    checkDialogToExistence,
    createVoidDialog,
    selectConversation
} from '../../store/conversations/actions';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import UserListItem from './UserListItem';
import _ from 'lodash';

interface Props {
    isOpened: boolean,
    onClose: () => void,
    isFetching: boolean,
    error: string,
    contacts: User[],
    foundUsers: User[],
    findContacts: () => void,
    findUsers: (string: string, event: "buttonClick" | "listScroll") => void,
    clearFoundUsers: () => void,
    resetState: () => void,
    addContact: (id: number, index: number) => void,
    deleteContact: (id: number, index: number) => void,
    checkDialogToExistence: (user: User) => Promise<number | null>,
    createVoidDialog: (user: User) => void,
    selectConversation: (id: number) => void
}

interface State {
    view: "contacts" | "search",
    search: string
}

class Contacts extends React.Component<Props, State> {
    userListRef: React.RefObject<HTMLDivElement> = React.createRef();
    state: State = {
        view: "contacts",
        search: ""
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            this.props.findContacts();
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            this.props.resetState();
            this.setState({ view: "contacts" });
        }
    }

    toggleView = () => {
        if (this.state.view === "contacts") {
            this.setState({ view: "search" });
            this.props.clearFoundUsers();
        } else {
            this.setState({ view: "contacts" });
        }
    }

    handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ search: e.target.value });
    }

    handleScrollSearch = () => {
        if (!this.userListRef.current) {
            console.error("Error: 'userListRef' is null");
            return;
        }

        const userListRef = this.userListRef.current;
        const listHeight = userListRef.scrollHeight - userListRef.clientHeight;

        if (listHeight - userListRef.scrollTop === 0) {
            this.props.findUsers(this.state.search, "listScroll");
        }
    }

    handleButtonClickSearch = () => {
        if (!this.userListRef.current) {
            console.error("Error: 'userListRef' is null");
            return;
        }

        this.userListRef.current.scrollTop = 0;
        this.props.findUsers(this.state.search, "buttonClick");
    }

    handleUserClick = async (user: User) => {
        try {
            const dialogId = await this.props.checkDialogToExistence(user);

            if (dialogId) {
                this.props.selectConversation(dialogId);
            } else {
                this.props.createVoidDialog(user);
            }
            this.props.onClose();
        } catch (e) {
            notify.error(e.message);
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpened} onClose={this.props.onClose}>
                <DialogTitle>
                    <span>{this.state.view === "contacts" ? "Contacts" : "Search"}</span>

                    {this.props.isFetching &&
                        <CircularProgress color="primary"
                            size={22}
                            thickness={4}
                            classes={{ root: styles.spinner }}
                        />
                    }
                </DialogTitle>

                {this.state.view === "contacts" &&
                    <div className={styles.user_list}>
                        <List dense>
                            {this.props.contacts.map((user, i) => {
                                return (
                                    <UserListItem key={user.id}
                                        user={user}
                                        onClick={() => this.handleUserClick(user)}
                                        action={
                                            <IconButton onClick={() => this.props.deleteContact(user.id, i)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    />
                                );
                            })}
                        </List>
                    </div>
                }

                {this.state.view === "search" &&
                    <div>
                        <DialogContent>
                            <FormControl fullWidth>
                                <Input value={this.state.search}
                                    onChange={this.handleChangeSearch}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton onClick={this.handleButtonClickSearch}>
                                                <SearchIcon />
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                />
                            </FormControl>
                        </DialogContent>

                        <div className={styles.user_list}
                            ref={this.userListRef}
                            onScroll={this.handleScrollSearch}
                        >
                            <List dense>
                                {this.props.foundUsers.map((user, i) => {
                                    return (
                                        <UserListItem key={user.id}
                                            user={user}
                                            onClick={() => this.handleUserClick(user)}
                                            action={
                                                <IconButton disabled={user.inContacts}
                                                    onClick={() => this.props.addContact(user.id, i)}
                                                >
                                                    {user.inContacts ? <CheckIcon /> : <AddIcon />}
                                                </IconButton>
                                            }
                                        />
                                    );
                                })}
                            </List>
                        </div>
                    </div>
                }

                <DialogActions>
                    {this.state.view === "contacts" &&
                        <div className={styles.left_action_button}>
                            <Button onClick={this.toggleView} color="primary">
                                Find users
                            </Button>
                        </div>
                    }

                    {this.state.view === "search" &&
                        <div className={styles.left_action_button}>
                            <Button onClick={this.toggleView} color="primary">
                                Cancel
                            </Button>
                        </div>
                    }

                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

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
    checkDialogToExistence: (user: User) => dispatch(checkDialogToExistence(user)),
    createVoidDialog: (user: User) => dispatch(createVoidDialog(user)),
    selectConversation: (id: number) => dispatch(selectConversation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Contacts);

import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';

import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Divider,
    IconButton,
    InputBase,
    List
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import AddIcon from '@material-ui/icons/Add';
import DeleteIcon from '@material-ui/icons/Delete';
import CheckIcon from '@material-ui/icons/Check';

import { User } from '../../types';
import UserListItem from '../UserListItem/UserListItem';
import _ from 'lodash';

interface Props {
    isOpened: boolean,
    onClose: () => void,
    isFetching: boolean,
    error: string | null,
    contacts: User[],
    foundUsers: User[],
    findContacts: () => void,
    findUsers: (string: string, event: "buttonClick" | "listScroll") => void,
    clearFoundUsers: () => void,
    resetState: () => void,
    addContact: (id: number, index: number) => void,
    deleteContact: (id: number, index: number) => void,
    selectDialogOrCreateNew: (user: User) => void
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
        this.setState({ search: "" });

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

    handleButtonClickSearchUsers = () => {
        if (!this.userListRef.current) {
            console.error("Error: 'userListRef' is null");
            return;
        }

        this.userListRef.current.scrollTop = 0;
        this.props.findUsers(this.state.search, "buttonClick");
    }

    handleUserClick = async (user: User) => {
        try {
            await this.props.selectDialogOrCreateNew(user);
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
                <Divider />

                <div>
                    <div className={styles.search_form}>
                        <InputBase autoFocus
                            fullWidth
                            value={this.state.search}
                            onChange={this.handleChangeSearch}
                        />

                        <IconButton color="primary"
                            disabled={this.state.view === "contacts"}
                            onClick={this.handleButtonClickSearchUsers}
                        >
                            <SearchIcon />
                        </IconButton>
                    </div>
                    <Divider />

                    {this.state.view === "contacts" &&
                        <div className={styles.user_list}>
                            <List dense>
                                {this.props.contacts.map((user, i) => {
                                    const name = user.firstName + " " + user.lastName;
                                    if (name.toLowerCase().includes(this.state.search.toLowerCase())) {
                                        return (
                                            <UserListItem key={user.id}
                                                button
                                                user={user}
                                                onClick={() => this.handleUserClick(user)}
                                                secondaryAction={
                                                    <IconButton onClick={() => this.props.deleteContact(user.id, i)}>
                                                        <DeleteIcon />
                                                    </IconButton>
                                                }
                                            />
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                            </List>
                        </div>
                    }

                    {this.state.view === "search" &&
                        <div className={styles.user_list}
                            ref={this.userListRef}
                            onScroll={this.handleScrollSearch}
                        >
                            <List dense>
                                {this.props.foundUsers.map((user, i) => {
                                    return (
                                        <UserListItem key={user.id}
                                            button
                                            user={user}
                                            onClick={() => this.handleUserClick(user)}
                                            secondaryAction={
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
                    }
                </div>

                <Divider />
                <DialogActions>
                    <div className={styles.left_action_button}>
                        <Button onClick={this.toggleView} color="primary">
                            {this.state.view === "contacts"? "Find users" : "Cancel"}
                        </Button>
                    </div>

                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default Contacts;

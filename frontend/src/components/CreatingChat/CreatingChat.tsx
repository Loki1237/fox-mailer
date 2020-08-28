import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';
import { User } from '../../types';
import UserListItem from './UserListItem';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    List,
    TextField
} from '@material-ui/core';

interface Props {
    isOpened: boolean,
    onClose: () => void,
    isFetching: boolean,
    error: string | null,
    contacts: User[],
    findContacts: () => void,
    resetContactsState: () => void,
    createChatAndSelect: (name: string, userIds: number[]) => void
}

interface State {
    chatName: string,
    userIds: number[]
}

class CreatingChat extends React.Component<Props, State> {
    state: State = {
        chatName: "",
        userIds: []
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            this.props.findContacts();
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            this.props.resetContactsState();
        }
    }

    handleChangeChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ chatName: e.target.value });
    }

    handleChangeUserSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const userIds = this.state.userIds;

        if (e.target.checked ) {
            this.setState({ userIds: [...userIds, +e.target.value ] });
        } else {
            const index = userIds.indexOf(+e.target.value);

            if (index >= 0){
                userIds.splice(index, 1);
                this.setState({ userIds });
            }
        }
    }

    handleClickCreateChatButton = async () => {
        const { chatName, userIds } = this.state;

        if (!chatName) {
            notify.warn("Enter the name of the chat");
            return;
        }

        try {
            await this.props.createChatAndSelect(chatName, userIds);
            this.props.onClose();
        } catch (e) {
            notify.error(e.message);
        }
    }

    render() {
        return (
            <Dialog open={this.props.isOpened} onClose={this.props.onClose}>
                <DialogTitle>Create chat</DialogTitle>

                <DialogContent>
                    <TextField fullWidth
                        label="Name of chat"
                        value={this.state.chatName}
                        onChange={this.handleChangeChatName}
                    />
                </DialogContent>
                <div className={styles.user_list}>
                    <List dense>
                        {this.props.contacts.map(user => {
                            return (
                                <UserListItem key={user.id}
                                    user={user}
                                    setSelected={this.handleChangeUserSelected}
                                />
                            );
                        })}
                    </List>
                </div>

                <DialogActions>
                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>

                    <Button onClick={this.handleClickCreateChatButton} color="primary">
                        Create
                    </Button>
                </DialogActions>
            </Dialog>
        );
    }
}

export default CreatingChat;

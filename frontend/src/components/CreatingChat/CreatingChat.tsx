import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';
import { User } from '../../types';
import UserListItem from '../UserListItem/UserListItem';

import {
    Button,
    Checkbox,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
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
    participantIds: number[]
}

class CreatingChat extends React.Component<Props, State> {
    state: State = {
        chatName: "",
        participantIds: []
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            this.props.findContacts();
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            this.props.resetContactsState();
            this.setState({ participantIds: [] });
        }
    }

    handleChangeChatName = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ chatName: e.target.value });
    }

    handleChangeUserSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const participantIds = this.state.participantIds;

        if (e.target.checked ) {
            this.setState({ participantIds: [...participantIds, +e.target.value ] });
        } else {
            const index = participantIds.indexOf(+e.target.value);

            if (index >= 0){
                participantIds.splice(index, 1);
                this.setState({ participantIds });
            }
        }
    }

    handleClickCreateChatButton = async () => {
        const { chatName, participantIds } = this.state;

        if (!chatName) {
            notify.warn("Enter the name of the chat");
            return;
        }

        try {
            await this.props.createChatAndSelect(chatName, participantIds);
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

                <Divider />
                <div className={styles.user_list}>
                    <List dense>
                        {this.props.contacts.map(user => {
                            return (
                                <UserListItem key={user.id}
                                    selected={this.state.participantIds.includes(user.id)}
                                    user={user}
                                    secondaryAction={
                                        <Checkbox color="primary"
                                            value={user.id}
                                            onChange={this.handleChangeUserSelected}
                                        />
                                    }
                                />
                            );
                        })}
                    </List>
                </div>
                <Divider />

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

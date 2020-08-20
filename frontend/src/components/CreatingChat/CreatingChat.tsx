import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';
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

import { connect } from 'react-redux';
import { User } from '../../store/contacts/types';
import { findContacts, resetState, } from '../../store/contacts/actions';
import { createChat, selectConversation } from '../../store/conversations/actions';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';

interface Props {
    isOpened: boolean,
    onClose: () => void,
    isFetching: boolean,
    error: string,
    contacts: User[],
    findContacts: () => void,
    resetContactsState: () => void,
    createChat: (name: string, userIds: number[]) => Promise<number>,
    selectConversation: (id: number) => void
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
            const newChatId = await this.props.createChat(chatName, userIds);
            await this.props.selectConversation(newChatId);
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

const mapStateToProps = (state: RootState) => ({
    isFetching: state.contacts.isFetching,
    error: state.contacts.error,
    contacts: state.contacts.contacts
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    findContacts: () => dispatch(findContacts()),
    resetContactsState: () => dispatch(resetState()),
    createChat: (name: string, userIds: number[]) => dispatch(createChat(name, userIds)),
    selectConversation: (id: number) => dispatch(selectConversation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreatingChat);

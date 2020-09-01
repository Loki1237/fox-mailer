import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';

import { Conversation, Message } from '../../types/conversationsTypes';
import { User } from '../../types';

import {
    Checkbox,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    IconButton,
    List,
    Typography
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import ClearIcon from '@material-ui/icons/Clear';
import CheckIcon from '@material-ui/icons/Check';

import UserListItem from '../UserListItem/UserListItem';
import _ from 'lodash';

interface Props {
    isOpened: boolean,
    onClose: () => void,
    currentConversation: Conversation | null,
    isFetching: boolean,
    error: string | null,
    contacts: User[],
    currentUser: User | null,
    findContacts: () => void,
    resetContacts: () => void,
    addUsersToCurrentChat: (userIds: number[]) => void,
    deleteUserFromChat: (chatId: number, userId: number) => void
}

interface State {
    view: "chat_data" | "add_participants",
    newParticipantIds: number[]
}

class ManagingChat extends React.Component<Props, State> {
    state: State = {
        view: "chat_data",
        newParticipantIds: []
    }

    componentDidUpdate(prevProps: Props) {
        if (this.props.isOpened !== prevProps.isOpened && this.props.isOpened) {
            this.props.findContacts();
        }

        if (this.props.isOpened !== prevProps.isOpened && !this.props.isOpened) {
            this.props.resetContacts();
            this.setState({ view: "chat_data" });
        }
    }

    toggleView = (view: "chat_data" | "add_participants") => {
        this.setState({ view });
    }

    handleChangeUserSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newParticipantIds = this.state.newParticipantIds;

        if (e.target.checked ) {
            this.setState({ newParticipantIds: [...newParticipantIds, +e.target.value ] });
        } else {
            const index = newParticipantIds.indexOf(+e.target.value);

            if (index >= 0){
                newParticipantIds.splice(index, 1);
                this.setState({ newParticipantIds });
            }
        }
    }

    handleClickAddParticipantsButton = () => {
        this.props.addUsersToCurrentChat(this.state.newParticipantIds);
    }

    handleClickDeleteParticipant = (userId: number) => {
        const chatId = this.props.currentConversation?.id || 0;
        this.props.deleteUserFromChat(chatId, userId);
    }

    render() {
        return (
            <Dialog open={this.props.isOpened && !!this.props.currentConversation}
                onClose={this.props.onClose}
            >
                <DialogTitle>
                    {this.state.view === "chat_data" ? "Data of chat" : "Add participants"}
                </DialogTitle>

                {this.state.view === "chat_data" &&
                    <DialogContent>
                        <div className={styles.row}>
                            <Typography noWrap>Name: {this.props.currentConversation?.name}</Typography>
                            <IconButton size="small">
                                <EditIcon fontSize="small" />
                            </IconButton>
                        </div>

                        <div className={styles.row}>
                            <Typography>Participants</Typography>
                            <IconButton size="small" onClick={() => this.toggleView("add_participants")}>
                                <AddIcon />
                            </IconButton>
                        </div>
                    </DialogContent>
                }

                <Divider />
                {this.state.view === "chat_data" &&
                    <div className={styles.chat_participants_list}>
                        <List dense>
                            {this.props.currentConversation?.participants.map(user => (
                                <UserListItem key={user.id}
                                    user={user}
                                    secondaryAction={
                                        this.props.currentConversation?.creatorId === this.props.currentUser?.id &&
                                        user.id !== this.props.currentUser?.id
                                            ? <IconButton size="small"
                                                onClick={() => this.handleClickDeleteParticipant(user.id)}
                                            >
                                                <ClearIcon />
                                            </IconButton>
                                            : undefined
                                    }
                                />
                            ))}
                        </List>
                    </div>
                }

                {this.state.view === "add_participants" &&
                    <div className={styles.chat_participants_list} style={{ height: 350 }}>
                        <List dense>
                            {this.props.contacts.map(user => (
                                <UserListItem key={user.id}
                                    user={user}
                                    selected={this.state.newParticipantIds.includes(user.id)}
                                    secondaryAction={
                                        _.findIndex(this.props.currentConversation?.participants, { id: user.id }) < 0
                                            ? <Checkbox color="primary"
                                                value={user.id}
                                                onChange={this.handleChangeUserSelected}
                                            />
                                            : <IconButton disabled>
                                                <CheckIcon />
                                            </IconButton>
                                    }
                                />
                            ))}
                        </List>
                    </div>
                }
                <Divider />

                <DialogActions>
                    {this.state.view !== "chat_data" &&
                        <Button onClick={() => this.toggleView("chat_data")} color="primary">
                            Cancel
                        </Button>
                    }

                    <Button onClick={this.props.onClose} color="primary">
                        Close
                    </Button>

                    {this.state.view === "add_participants" &&
                        <Button color="primary"
                            variant="contained"
                            disableElevation
                            onClick={this.handleClickAddParticipantsButton}
                        >
                            Add
                        </Button>
                    }
                </DialogActions>
            </Dialog>
        );
    }
}

export default ManagingChat;

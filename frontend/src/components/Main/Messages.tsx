/*
 * TODO: добавить имя автора для каждого сообщения в чатах
 *       подправить функцию createDate
 *       сделать поиск сообщений
 *       сделать добавление пользователей в чат
 */

import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';
import _ from 'lodash';

import InputString from './InputString';
import MessageListItem from './MessageListItem';

import { Conversation, Message } from '../../types/conversationsTypes';
import { WsOutgoingTextMessage } from '../../types/webSocketTypes';
import { User } from '../../types';

import {
    Avatar,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography
} from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import InfoIcon from '@material-ui/icons/InfoOutlined';

interface Props {
    isFetching: boolean
    error: string | null,
    conversations: Conversation[],
    currentConversation: Conversation | null,
    currentUser: User | null,
    resetCurrentConversation: () => void,
    createDialogAndSelect: (interlocutorId: number, firstMessageText: string) => void,
    getMessages: () => void,
    sendWebSocketMessage: (conversationId: number, text: string) => void
}

interface State {
    message: string,
    chatDataWindow: boolean
}

class Messages extends React.Component<Props, State> {
    messageListRef: React.RefObject<HTMLDivElement> = React.createRef();
    state: State = {
        message: "",
        chatDataWindow: false
    }

    componentDidMount() {
        window.addEventListener("keydown", this.handlePressKeyEsc);
    }

    handlePressKeyEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            this.props.resetCurrentConversation();
        }
    }

    createDate = (currentMessage: Message, prevMessage: Message) => {
        const months = [
            "january", "february", "march", "april", "may", "june", "july", "august", "september", "october",
            "november", "december"
        ];

        const currentMessageDate = new Date(currentMessage.createdAt);
        let prevMessageDate: Date | null = null;
        if (prevMessage) {
            prevMessageDate = new Date(prevMessage.createdAt);
        }

        if (prevMessageDate && currentMessageDate.getDate() === prevMessageDate.getDate()) {
            return null;
        }

        let dateString = "";

        const date = currentMessageDate.getDate();
        const month = months[currentMessageDate.getMonth()];
        const year = currentMessageDate.getFullYear();
        dateString = `${date} ${month} ${year}`;

        return dateString;
    }

    handleChangeTextField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        this.setState({ message: e.target.value });
    }

    handleClickSendButton = async () => {
        let currentConversation = this.props.currentConversation;

        if (currentConversation && currentConversation.type === "newDialog") {
            try {
                this.props.createDialogAndSelect(currentConversation.participants[0].id, this.state.message);
                this.setState({ message: "" });
            } catch (e) {
                notify.error(e.message);
            }
        } else if (currentConversation) {
            this.sendMessage();
        }
    }

    sendMessage = () => {
        if (!this.props.currentConversation) return;

        this.props.sendWebSocketMessage(this.props.currentConversation.id, this.state.message);
        this.setState({ message: "" });
    }

    toggleChatDataWindow = (isOpened: boolean) => {
        this.setState({ chatDataWindow: isOpened });
    }

    handleScrollMessages = () => {
        if (!this.messageListRef.current) {
            console.error("Error: 'messageListRef' is null");
            return;
        }

        if (this.messageListRef.current.scrollTop <= 10) {
            this.props.getMessages();
        }

        if (this.messageListRef.current.scrollTop <= 1) {
            this.messageListRef.current.scrollTop = 1;
        }
    }

    render() {
        return (
            <div className={styles.Messages}>
                {this.props.currentConversation &&
                    <div className={styles.header}>
                        <Button size="small"
                            color="primary"
                            onClick={this.props.resetCurrentConversation}
                        >
                            Cancel
                        </Button>

                        <Typography variant="body1">
                            {this.props.currentConversation?.name}
                        </Typography>

                        <div>
                            <IconButton size="small">
                                <SearchIcon />
                            </IconButton>

                            {this.props.currentConversation?.type === "chat" &&
                                <IconButton size="small" onClick={() => this.toggleChatDataWindow(true)}>
                                    <InfoIcon />
                                </IconButton>
                            }
                        </div>
                    </div>
                }

                <div className={styles.container} ref={this.messageListRef} onScroll={this.handleScrollMessages}>
                    {this.props.currentConversation?.messages.map((message, i, arr) => {
                        const messageCreatedDate = this.createDate(message, arr[i+1]);

                        return (
                            <React.Fragment key={"message-" + message.id}>
                                <MessageListItem message={message}
                                    align={message.authorId === this.props.currentUser?.id ? "right" : "left"}
                                />
                                {messageCreatedDate &&
                                    <div className={styles.date}>
                                        <div className={styles.body}>
                                            <span>{messageCreatedDate}</span>
                                        </div>
                                    </div>
                                }
                            </React.Fragment>
                        );
                    })}

                    {this.props.currentConversation === null &&
                        <div className={styles.void_conversation_message}>
                            <div>
                                <Typography variant="body2">
                                    Please select a conversation or create a new one
                                </Typography>
                            </div>
                        </div>
                    }
                </div>

                {this.props.currentConversation &&
                    <InputString message={this.state.message}
                        writeMessage={this.handleChangeTextField}
                        sendMessage={this.handleClickSendButton}
                    />
                }

                <Dialog open={this.state.chatDataWindow && this.props.currentConversation !== null}
                    onClose={() => this.toggleChatDataWindow(false)}
                >
                    <DialogTitle>Data of chat</DialogTitle>

                    <DialogContent>
                        <Typography>Name: {this.props.currentConversation?.name}</Typography>
                        <Typography>Participants:</Typography>
                    </DialogContent>
                    <div className={styles.chat_participants_list}>
                        <List dense>
                            {this.props.currentConversation?.participants.map(user => {
                                const fullName = user.firstName + " " + user.lastName;
                                const userName = user.userName;

                                return (
                                    <ListItem key={user.id} dense>
                                        <ListItemAvatar>
                                            <Avatar>{user.firstName[0]}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText primary={fullName} secondary={userName} />
                                    </ListItem>
                                );
                            })}
                        </List>
                    </div>

                    <DialogActions>
                        <Button onClick={() => this.toggleChatDataWindow(false)} color="primary">
                            Close
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Messages;

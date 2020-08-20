/*
 * TODO: добавить имя автора для каждого сообщения в чатах
 *       подправить функцию createDate
 *       сделать поиск сообщений
 */

import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';
import messageSound from '../../assets/sounds/message.mp3';

import InputString from './InputString';
import MessageListItem from './MessageListItem';

import { connect } from 'react-redux';
import {
    resetCurrentConversation,
    addMessageInCurrentConversation,
    setLastMessageInConversation,
    createDialog,
    selectConversation
} from '../../store/conversations/actions';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import { Conversation, Message } from '../../store/conversations/types';
import { User } from '../../store/auth/types';

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
    error: string,
    conversations: Conversation[],
    currentConversation: Conversation | null,
    currentUser: User | null,
    resetCurrentConversation: () => void,
    addMessageInCurrentConversation: (message: Message) => void,
    setLastMessageInConversation: (conversationId: number, message: Message) => void,
    createDialog: (interlocutorId: number) => Promise<number>,
    selectConversation: (id: number) => void
}

interface State {
    message: string,
    chatDataWindow: boolean
}

class Messages extends React.Component<Props, State> {
    messagesWebSocket: WebSocket = new WebSocket('ws://localhost:3000/messages');
    messageSound: HTMLAudioElement = new Audio(messageSound);
    state: State = {
        message: "",
        chatDataWindow: false
    }

    componentDidMount() {
        this.messagesWebSocket.addEventListener("message", this.handleReceiveMessage);
    }

    handleReceiveMessage = (message: MessageEvent) => {
        const currentConversation = this.props.currentConversation;
        const parsedMessage: Message = JSON.parse(message.data);

        this.props.setLastMessageInConversation(parsedMessage.conversationId, parsedMessage);
        if (currentConversation && parsedMessage.conversationId === currentConversation.id) {
            this.props.addMessageInCurrentConversation(parsedMessage);
        }

        const isIncomingMessages = parsedMessage.authorId !== this.props.currentUser?.id;
        if (isIncomingMessages) {
            this.messageSound.play();
        }

        if (isIncomingMessages && parsedMessage.conversationId !== this.props.currentConversation?.id) {
            notify.info(`Message: ${parsedMessage.text}`);
        }
    }

    createConversationName = () => {
        if (!this.props.currentConversation) {
            return "";
        } else {
            return this.props.currentConversation.name;
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
                const newDialogId = await this.props.createDialog(currentConversation.participants[0].id);
                await this.props.selectConversation(newDialogId);

                currentConversation = this.props.currentConversation;
                if (currentConversation && currentConversation.id !== 0) {
                    this.sendMessage(currentConversation.id);
                }
            } catch (e) {
                notify.error(e.message);
            }
        } else if (currentConversation) {
            this.sendMessage(currentConversation.id);
        }
    }

    sendMessage = (conversationId: number) => {
        const newMessage = {
            conversationId,
            text: this.state.message
        };

        this.messagesWebSocket.send(JSON.stringify(newMessage));
        this.setState({ message: "" });
    }

    toggleChatDataWindow = (isOpened: boolean) => {
        this.setState({ chatDataWindow: isOpened });
    }

    render() {
        const conversationName = this.createConversationName();

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
                            {conversationName}
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

                <div className={styles.container}>
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

const mapStateToProps = (state: RootState) => ({
    isFetching: state.conversations.isFetching,
    error: state.conversations.error,
    conversations: state.conversations.conversations,
    currentConversation: state.conversations.currentConversation,
    currentUser: state.auth.user
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    resetCurrentConversation: () => dispatch(resetCurrentConversation()),
    addMessageInCurrentConversation: (message: Message) => dispatch(addMessageInCurrentConversation(message)),
    setLastMessageInConversation: (conversationId: number, message: Message) => dispatch(setLastMessageInConversation(conversationId, message)),
    createDialog: (interlocutorId: number) => dispatch(createDialog(interlocutorId)),
    selectConversation: (id: number) => dispatch(selectConversation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Messages);

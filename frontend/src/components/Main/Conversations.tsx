import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';

import { Conversation } from '../../types/conversationsTypes';
import ConversationListItem from './ConversationListItem';

import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    List,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';

interface Props {
    screenMode: "full" | "small",
    isFetching: boolean
    error: string | null,
    conversations: Conversation[],
    currentConversation: Conversation | null,
    getConversations: () => void,
    selectConversation: (id: number) => void,
    deleteConversation: (id: number) => void
}

interface State {
    deleteConversationWindow: {
        isOpened: boolean,
        conversationId: number | undefined
    }
}

class Conversations extends React.Component<Props, State> {
    state: State = {
        deleteConversationWindow: {
            isOpened: false,
            conversationId: 0
        }
    }

    componentDidMount() {
        this.props.getConversations();
    }

    selectConversation = (id: number) => {
        const currentConversation = this.props.currentConversation;
        if (!currentConversation || currentConversation.id !== id) {
            try {
                this.props.selectConversation(id);
            } catch (e) {
                notify.error(e.message);
            }
        }
    }

    toggleDeleteConversationWindow = (isOpened: boolean, conversationId?: number) => {
        this.setState({
            deleteConversationWindow: {
                isOpened,
                conversationId
            }
        });
    }

    deleteConversation = async () => {
        const conversationId = this.state.deleteConversationWindow.conversationId;

        if (conversationId) {
            try {
                await this.props.deleteConversation(conversationId);
                this.toggleDeleteConversationWindow(false);
            } catch (e) {
                notify.error(e.message);
            }
        }
    }

    render() {
        return (
            <div className={styles.Conversations} style={{ width: this.props.screenMode === "full" ? "35%" : "100%" }}>
                <List disablePadding>
                    {this.props.conversations.map(conversation => {
                        return (
                            <ConversationListItem key={"conversation-" + conversation.id}
                                conversation={conversation}
                                selected={conversation.id === this.props.currentConversation?.id}
                                selectConversation={() => this.selectConversation(conversation.id)}
                                deleteConversation={() => this.toggleDeleteConversationWindow(true, conversation.id)}
                            />
                        );
                    })}
                </List>

                <Dialog open={this.state.deleteConversationWindow.isOpened}
                    onClose={() => this.toggleDeleteConversationWindow(false)}
                >
                    <DialogTitle>Delete conversation</DialogTitle>

                    <DialogContent>
                        <DialogContentText>
                            Are you sure you want to delete a conversation with this user?
                        </DialogContentText>
                    </DialogContent>

                    <DialogActions>
                        <Button color="primary" onClick={() => this.toggleDeleteConversationWindow(false)}>
                            Cancel
                        </Button>
                        <Button variant="contained"
                            color="primary"
                            disableElevation
                            onClick={this.deleteConversation}
                        >
                            Delete
                        </Button>
                    </DialogActions>
                </Dialog>
            </div>
        );
    }
}

export default Conversations;

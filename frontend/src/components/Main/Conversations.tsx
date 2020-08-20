import React from 'react';
import styles from './Styles.m.scss';
import { toast as notify } from 'react-toastify';

import { connect } from 'react-redux';
import { getConversations, selectConversation, deleteConversation } from '../../store/conversations/actions';
import { Conversation } from '../../store/conversations/types';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
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

interface Props {
    fullScreen: boolean,
    isFetching: boolean
    error: string,
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
            this.props.selectConversation(id)
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
            <div className={styles.Conversations} style={{ width: this.props.fullScreen ? "100%" : "35%" }}>
                <List>
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
                        <Button variant="outlined"
                            color="primary"
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

const mapStateToProps = (state: RootState) => ({
    isFetching: state.conversations.isFetching,
    error: state.conversations.error,
    conversations: state.conversations.conversations,
    currentConversation: state.conversations.currentConversation
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    getConversations: () => dispatch(getConversations()),
    selectConversation: (id: number) => dispatch(selectConversation(id)),
    deleteConversation: (id: number) => dispatch(deleteConversation(id))
});

export default connect(mapStateToProps, mapDispatchToProps)(Conversations);

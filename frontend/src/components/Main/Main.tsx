import React from 'react';
import styles from './Styles.m.scss';
import Conversations from './Conversations';
import Messages from './Messages';

import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { Conversation } from '../../store/conversations/types';

interface Props {
    currentConversation: Conversation | null,
    smallScreenMode: boolean
}

interface State {
    compactMode: boolean
}

class Main extends React.Component<Props, State> {
    render() {
        const renderConversations = !this.props.currentConversation || !this.props.smallScreenMode;
        const renderMessages = this.props.currentConversation || !this.props.smallScreenMode;

        return (
            <div className={styles.Main}>
                {renderConversations && <Conversations fullScreen={this.props.smallScreenMode} />}
                {renderMessages && <Messages />}
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    currentConversation: state.conversations.currentConversation
});

export default connect(mapStateToProps)(Main);

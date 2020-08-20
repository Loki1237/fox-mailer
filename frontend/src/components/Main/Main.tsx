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

const Main = (props: Props) => {
    const renderConversations = !props.currentConversation || !props.smallScreenMode;
    const renderMessages = props.currentConversation || !props.smallScreenMode;

    return (
        <div className={styles.Main}>
            {renderConversations && <Conversations fullScreen={props.smallScreenMode} />}
            {renderMessages && <Messages />}
        </div>
    );
};

const mapStateToProps = (state: RootState) => ({
    currentConversation: state.conversations.currentConversation
});

export default connect(mapStateToProps)(Main);

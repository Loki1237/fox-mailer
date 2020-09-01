import React from 'react';
import styles from './Styles.m.scss';
import Conversations from '../../containers/Conversations';
import Messages from '../../containers/Messages';
import { Conversation } from '../../types/conversationsTypes';
import { ScreenMode } from '../../types/appTypes';

interface Props {
    currentConversation: Conversation | null,
    screenMode: ScreenMode
}

const Main = (props: Props) => {
    const renderConversations = !props.currentConversation || props.screenMode === ScreenMode.FULL;
    const renderMessages = props.currentConversation || props.screenMode === ScreenMode.FULL;

    return (
        <div className={styles.Main}>
            {renderConversations && <Conversations />}
            {renderMessages && <Messages />}
        </div>
    );
};

export default Main;

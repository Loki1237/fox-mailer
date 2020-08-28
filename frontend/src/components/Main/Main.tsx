import React from 'react';
import styles from './Styles.m.scss';
import Conversations from '../../containers/Conversations';
import Messages from '../../containers/Messages';
import { Conversation } from '../../types/conversationsTypes';

interface Props {
    currentConversation: Conversation | null,
    screenMode: "full" | "small"
}

const Main = (props: Props) => {
    const renderConversations = !props.currentConversation || props.screenMode === "full";
    const renderMessages = props.currentConversation || props.screenMode === "full";

    return (
        <div className={styles.Main}>
            {renderConversations && <Conversations />}
            {renderMessages && <Messages />}
        </div>
    );
};

export default Main;

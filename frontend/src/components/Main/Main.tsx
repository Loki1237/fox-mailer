import React from 'react';
import styles from './Styles.m.scss';
import Conversations from './Conversations';
import Messages from './Messages';

class Main extends React.Component {
    render() {
        return (
            <div className={styles.Main}>
                <Conversations />
                <Messages />
            </div>
        );
    }
}

export default Main;

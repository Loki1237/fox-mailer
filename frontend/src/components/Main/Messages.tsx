import React from 'react';
import styles from './Styles.m.css';
import InputString from './InputString';

class Messages extends React.Component {
    render() {
        return (
            <div className={styles.Messages}>
                <div className={styles.header}></div>
                <div className={styles.container}></div>
                <InputString />
            </div>
        );
    }
}

export default Messages;

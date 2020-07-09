import React from 'react';
import styles from './Styles.m.css';

import { IconButton, InputBase, TextField } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';

const InputString = () => {
    let [message, writeMessage] = React.useState("");

    const handleChangeTextField = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        writeMessage(e.target.value);
    }

    return (
        <div className={styles.InputString}>
            <IconButton aria-label="attach-file">
                <AttachFileIcon />
            </IconButton>

            <InputBase multiline
                rowsMax={5}
                style={{ flexGrow: 1, padding: "14px 0" }}
                placeholder="Enter message"
                autoFocus
                value={message}
                onChange={handleChangeTextField}
            />

            <IconButton aria-label="send-message" color="primary" disabled={!message}>
                <SendIcon />
            </IconButton>
        </div>
    );
}

export default InputString;

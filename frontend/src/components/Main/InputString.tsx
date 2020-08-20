import React from 'react';
import styles from './Styles.m.scss';

import { IconButton, InputBase, TextField } from '@material-ui/core';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import SendIcon from '@material-ui/icons/Send';

interface Props {
    message: string,
    writeMessage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void,
    sendMessage: () => void
}

const InputString = (props: Props) => {
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
                value={props.message}
                onChange={props.writeMessage}
            />

            <IconButton aria-label="send-message"
                color="primary"
                disabled={!props.message}
                onClick={props.sendMessage}
            >
                <SendIcon />
            </IconButton>
        </div>
    );
}

export default InputString;

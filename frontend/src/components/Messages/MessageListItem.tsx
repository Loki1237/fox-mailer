import React from 'react';
import styles from './Styles.m.scss';
import clsx from 'clsx';
import { Message } from '../../types/conversationsTypes';
import { Typography, } from '@material-ui/core';

interface Props {
    message: Message,
    align: "left" | "right"
}

const MessageListItem = (props: Props) => {
    const align = {
        left: "flex-start",
        right: "flex-end"
    }

    const date = new Date(props.message.createdAt);
    let hours: any = date.getHours();
    hours = hours>= 10 ? `${hours}` : `0${hours}`;
    let minutes: any = date.getMinutes();
    minutes = minutes >= 10 ? `${minutes}` : `0${minutes}`;

    const mesageBodyClasses = clsx({
        [styles.body]: true,
        [styles.body_align_left]: props.align === "left",
        [styles.body_align_right]: props.align === "right"
    });

    return (
        <div className={styles.message} style={{ justifyContent: align[props.align] }}>
            <div className={mesageBodyClasses}>
                <div className={styles.content}>
                    <Typography variant="body2">
                        {props.message.text}
                    </Typography>
                </div>

                <div className={styles.timestamp}>
                    <span>{hours + ":" + minutes}</span>
                </div>
            </div>
        </div>
    );
}

export default MessageListItem;

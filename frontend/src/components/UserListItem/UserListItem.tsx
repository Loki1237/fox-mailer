import React from 'react';
import styles from './Styles.m.scss';
import {
    Avatar,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { User } from '../../types';

interface Props {
    user: User,
    button?: boolean,
    selected?: boolean,
    secondaryAction?: React.ReactElement,
    onClick?: () => void
}

const UserListItem = (props: Props) => (
    <ListItem dense selected={props.selected} button onClick={props.onClick}>
        <ListItemAvatar>
            <Avatar>{props.user.firstName[0]}</Avatar>
        </ListItemAvatar>

        <ListItemText
            primary={props.user.firstName + " " + props.user.lastName}
            secondary={props.user.userName}
        />

        <ListItemSecondaryAction>
            {props.secondaryAction}
        </ListItemSecondaryAction>
    </ListItem>
);

export default UserListItem;

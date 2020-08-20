import React from 'react';
import {
    Avatar,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { User } from '../../store/contacts/types';

interface Props {
    user: User,
    action?: React.ReactElement,
    onClick: () => void
}

const UserListItem = (props: Props) => {
    return (
        <ListItem button onClick={props.onClick}>
            <ListItemAvatar>
                <Avatar>{props.user.firstName[0]}</Avatar>
            </ListItemAvatar>

            <ListItemText
                primary={props.user.firstName + " " + props.user.lastName}
                secondary={props.user.userName}
            />

            <ListItemSecondaryAction>
                {props.action}
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default UserListItem;

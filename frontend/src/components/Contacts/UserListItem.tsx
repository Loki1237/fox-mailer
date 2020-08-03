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
    action?: React.ReactElement
}

const UserListItem = (props: Props) => {
    return (
        <ListItem key={props.user.id} button>
            <ListItemAvatar>
                <Avatar>{props.user.firstName[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.user.firstName + " " + props.user.lastName} />
            <ListItemSecondaryAction>
                {props.action}
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default UserListItem;

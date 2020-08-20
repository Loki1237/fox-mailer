import React from 'react';
import {
    Avatar,
    Checkbox,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
} from '@material-ui/core';
import { User } from '../../store/contacts/types';

interface Props {
    user: User,
    setSelected: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const UserListItem = (props: Props) => {
    return (
        <ListItem>
            <ListItemAvatar>
                <Avatar>{props.user.firstName[0]}</Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.user.firstName + " " + props.user.lastName} />
            <ListItemSecondaryAction>
                <Checkbox color="primary" value={props.user.id} onChange={props.setSelected} />
            </ListItemSecondaryAction>
        </ListItem>
    );
}

export default UserListItem;

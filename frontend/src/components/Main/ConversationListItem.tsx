import React from 'react';
import { Conversation } from '../../store/conversations/types';
import {
    Avatar,
    Divider,
    IconButton,
    ListItem,
    ListItemAvatar,
    ListItemSecondaryAction,
    ListItemText,
    Typography
} from '@material-ui/core';
import GroupIcon from '@material-ui/icons/Group';
import ClearIcon from '@material-ui/icons/Clear';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        listItemRoot: {
            "&.Mui-selected": {
                backgroundColor: theme.palette.primary.main,
                "&:hover": {
                    backgroundColor: theme.palette.primary.main
                },
                "&:active": {
                    backgroundColor: theme.palette.primary.main
                }
            }
        },
        whiteText: {
            color: "#FFF"
        }
    })
);

interface Props {
    conversation: Conversation,
    selected: boolean,
    selectConversation: () => void,
    deleteConversation: () => void
}

const ConversationListItem = (props: Props) => {
    const conversationAvatar = props.conversation.type === "dialog" ? props.conversation.name[0] : <GroupIcon />;
    const classes = useStyles();
    const lastMessage = props.conversation.messages[0];

    return (
        <React.Fragment>
            <ListItem button
                dense
                classes={{ root: classes.listItemRoot }}
                selected={props.selected}
                onClick={props.selectConversation}
            >
                <ListItemAvatar>
                    <Avatar>{conversationAvatar}</Avatar>
                </ListItemAvatar>

                <ListItemText
                    primary={
                        <Typography noWrap
                            variant="subtitle2"
                            color="textPrimary"
                            classes={{ subtitle2: props.selected ? classes.whiteText : "" }}
                        >
                            {props.conversation.name}
                        </Typography>
                    }
                    secondary={
                        <Typography noWrap
                            variant="body2"
                            color="textSecondary"
                            classes={{ body2: props.selected ? classes.whiteText : "" }}
                        >
                            {lastMessage?.text || "..."}
                        </Typography>
                    }
                />

                <ListItemSecondaryAction>
                    <IconButton edge="end"
                        size="small"
                        onClick={props.deleteConversation}
                    >
                        <ClearIcon fontSize="small" classes={{ root: props.selected ? classes.whiteText : "" }} />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Divider variant={props.selected ? "fullWidth" : "inset"} component="li" />
        </React.Fragment>
    );
}

export default ConversationListItem;

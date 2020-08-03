import React from 'react';
import styles from './App.m.css';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Main from './components/Main/Main';
import Contacts from './components/Contacts/Contacts';
import 'fontsource-roboto';

import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import {
    AppBar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@material-ui/core';

export const history = createBrowserHistory();

const App = () => {
    let [menu, setMenu] = React.useState(false);
    let [contactWindow, setContactWindow] = React.useState(false);

    const openContactWindow = () => {
        setMenu(false);
        setContactWindow(true);
    }

    const closeContactWindow = () => {
        setContactWindow(false);
    }

    return (
	    <div className={styles.App}>
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setMenu(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1 }}>
                        Fox mailer
                    </Typography>
                </Toolbar>
            </AppBar>

            <Router history={history}>
                <Route path='/login'>
                    <Login />
                </Route>

                <Route path='/signup'>
                    <Signup />
                </Route>

                <Route path='/main'>
                    <Main />
                </Route>

                <Route path='/'>
                    <Contacts open={contactWindow} onClose={closeContactWindow} />
                </Route>
            </Router>

            <Drawer anchor="left" open={menu}
                onClose={() => setMenu(false)}
            >
                <List>
                    <ListItem button onClick={openContactWindow}>
                        <ListItemIcon><PeopleIcon /></ListItemIcon>
                        <ListItemText primary="Contacts" />
                    </ListItem>

                    <Divider />

                    <ListItem button>
                        <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                        <ListItemText primary="Выйти" />
                    </ListItem>
                </List>
            </Drawer>
        </div>
    );
}

export default App;

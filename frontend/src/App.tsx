import React from 'react';
import styles from './App.m.css';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import 'fontsource-roboto';

import MenuIcon from '@material-ui/icons/Menu';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton
} from '@material-ui/core';

export const history = createBrowserHistory();

const App = () => {
    return (
	    <div className={styles.App}>
            <AppBar position="relative">
                <Toolbar variant="dense">
                    <IconButton edge="start" color="inherit" aria-label="menu">
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
            </Router>
        </div>
    );
}

export default App;

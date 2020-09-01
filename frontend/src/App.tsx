import React from 'react';
import styles from './App.m.scss';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Login from './containers/Login';
import Signup from './containers/Signup';
import Main from './containers/Main';
import Contacts from './containers/Contacts';
import CreatingChat from './containers/CreatingChat';

import 'fontsource-roboto';
import { connect } from 'react-redux';
import { RootState } from './store/index';
import { AppThunkDispatch } from './store/thunk';

import MenuIcon from '@material-ui/icons/Menu';
import PeopleIcon from '@material-ui/icons/People';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ContactsIcon from '@material-ui/icons/Contacts';
import {
    AppBar,
    Avatar,
    Divider,
    Drawer,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@material-ui/core';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.notifications.scss';

import { setAppScreenMode } from './actions/appActions';
import { loginAs, logout } from './actions/authActions';
import { User } from './types';
import { ScreenMode } from './types/appTypes';

export const history = createBrowserHistory();

interface Props {
    currentUser: User | null,
    screenMode: ScreenMode,
    loginAs: () => void,
    logout: () => void,
    setAppScreenMode: (mode: ScreenMode) => void
}

interface State {
    sideMenu: boolean,
    contactWindow: boolean,
    creatingChatWindow: boolean
}

class App extends React.Component<Props, State> {
    state: State = {
        sideMenu: false,
        contactWindow: false,
        creatingChatWindow: false
    }

    componentDidMount() {
        this.loginAs();
        this.setScreenMode();
        window.addEventListener("resize", this.setScreenMode);
    }

    setScreenMode = () => {
        const screenWidth = document.body.clientWidth;
        if (screenWidth <= 620) {
            this.props.setAppScreenMode(ScreenMode.SMALL);
        } else {
            this.props.setAppScreenMode(ScreenMode.FULL);
        }
    }

    loginAs = async () => {
        try {
            await this.props.loginAs();
            history.push('/main');
        } catch {
            history.push('/login');
        }
    }

    logout = () => {
        try {
            this.props.logout();
            this.toggleSideMenu(false);
            history.push('/login');
        } catch (e) {
            console.error(e.message);
        }
    }

    toggleSideMenu = (isOpened: boolean) => {
        this.setState({ sideMenu: isOpened });
    }

    toggleContactWindow = (isOpened: boolean) => {
        this.toggleSideMenu(false);
        this.setState({ contactWindow: isOpened });
    }

    toggleCreatingChatWindow = (isOpened: boolean) => {
        this.toggleSideMenu(false);
        this.setState({ creatingChatWindow: isOpened });
    }

    render() {
        return (
            <div className={styles.App}>
                <AppBar position="relative">
                    <Toolbar variant="dense">
                        {this.props.currentUser &&
                            <IconButton edge="start" color="inherit" onClick={() => this.toggleSideMenu(true)}>
                                <MenuIcon />
                            </IconButton>
                        }

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
                        <Contacts isOpened={this.state.contactWindow}
                            onClose={() => this.toggleContactWindow(false)}
                        />

                        <CreatingChat isOpened={this.state.creatingChatWindow}
                            onClose={() => this.toggleCreatingChatWindow(false)}
                        />
                    </Route>
                </Router>

                <Drawer anchor="left"
                    open={this.state.sideMenu}
                    onClose={() => this.toggleSideMenu(false)}
                >
                    <List classes={{ root: styles.side_menu }}>
                        <ListItem>
                            <ListItemAvatar>
                                <Avatar>{this.props.currentUser?.firstName[0]}</Avatar>
                            </ListItemAvatar>

                            <ListItemText
                                primary={this.props.currentUser?.firstName + " " + this.props.currentUser?.lastName}
                                secondary={this.props.currentUser?.userName}
                            />
                        </ListItem>

                        <Divider />

                        <ListItem button onClick={() => this.toggleCreatingChatWindow(true)}>
                            <ListItemIcon><PeopleIcon /></ListItemIcon>
                            <ListItemText primary="Create chat" />
                        </ListItem>

                        <ListItem button onClick={() => this.toggleContactWindow(true)}>
                            <ListItemIcon><ContactsIcon /></ListItemIcon>
                            <ListItemText primary="Contacts" />
                        </ListItem>

                        <Divider />

                        <ListItem button onClick={this.logout}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary="Logout" />
                        </ListItem>
                    </List>
                </Drawer>

                <ToastContainer
                    position="bottom-left"
                    autoClose={5000}
                    hideProgressBar
                    newestOnTop
                    closeOnClick
                    rtl={false}
                    draggable={false}
                    closeButton={false}
                    pauseOnFocusLoss
                    pauseOnHover
                    limit={4}
                />
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    currentUser: state.auth.user,
    screenMode: state.app.screenMode
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    loginAs: () => dispatch(loginAs()),
    logout: () => dispatch(logout()),
    setAppScreenMode: (mode: ScreenMode) => dispatch(setAppScreenMode(mode))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

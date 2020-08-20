import React from 'react';
import styles from './App.m.scss';
import { Router, Route } from 'react-router-dom';
import { createBrowserHistory } from 'history';

import Login from './components/Auth/Login';
import Signup from './components/Auth/Signup';
import Main from './components/Main/Main';
import Contacts from './components/Contacts/Contacts';
import CreatingChat from './components/CreatingChat/CreatingChat';

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
    ListItemIcon,
    ListItemText,
    Toolbar,
    Typography
} from '@material-ui/core';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.notifications.scss';

import { loginAs, logout } from './store/auth/actions';
import { User } from './store/auth/types';

export const history = createBrowserHistory();

interface Props {
    currentUser: User | null,
    loginAs: () => void,
    logout: () => void
}

interface State {
    sideMenu: boolean,
    contactWindow: boolean,
    creatingChatWindow: boolean,
    smallScreenMode: boolean
}

class App extends React.Component<Props, State> {
    state: State = {
        sideMenu: false,
        contactWindow: false,
        creatingChatWindow: false,
        smallScreenMode: false
    }

    componentDidMount() {
        this.loginAs();
        this.setSmallScreenMode();
        window.addEventListener("resize", this.setSmallScreenMode);
    }

    setSmallScreenMode = () => {
        const screenWidth = document.body.clientWidth;
        if (screenWidth <= 620) {
            this.setState({ smallScreenMode: true });
        } else {
            this.setState({ smallScreenMode: false });
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
                        <Login smallScreenMode={this.state.smallScreenMode} />
                    </Route>

                    <Route path='/signup'>
                        <Signup smallScreenMode={this.state.smallScreenMode} />
                    </Route>

                    <Route path='/main'>
                        <Main smallScreenMode={this.state.smallScreenMode} />
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

                <Drawer anchor="left" open={this.state.sideMenu}
                    onClose={() => this.toggleSideMenu(false)}
                >
                    <div className={styles.side_menu_header}>
                        <Avatar>{this.props.currentUser?.firstName[0]}</Avatar>
                        <div className={styles.user_data}>
                            <Typography variant="body1" noWrap>{this.props.currentUser?.firstName}</Typography>
                            <Typography variant="body1" noWrap>{this.props.currentUser?.lastName}</Typography>
                        </div>
                    </div>

                    <List>
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
    currentUser: state.auth.user
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    loginAs: () => dispatch(loginAs()),
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

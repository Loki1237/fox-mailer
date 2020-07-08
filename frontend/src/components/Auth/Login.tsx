import React from 'react';
import styles from './Styles.m.css';
import logo from '../../assets/images/logo.png';

import { Visibility, VisibilityOff } from '@material-ui/icons';
import {
    Button,
    CircularProgress,
    IconButton,
    Input,
    InputLabel,
    InputAdornment,
    FormControl,
    TextField,
    Typography
} from '@material-ui/core';

import { withSnackbar, SnackbarMessage, OptionsObject } from 'notistack';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import { login } from '../../store/auth/actions';
import { history } from '../../App';

interface Props {
    isFetching: boolean,
    error: string,
    login: (userName: string, password: string) => void,
    enqueueSnackbar: (message: SnackbarMessage, options: OptionsObject) => void
}

class Login extends React.Component<Props>  {
    state = {
        userName: "",
        password: "",
        showPassword: false
    }

    handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    login = async () => {
        const { userName, password } = this.state;

        if (!userName || !password) {
            this.props.enqueueSnackbar("Enter your username and password", { variant: "warning" });
            return;
        }

        try {
            await this.props.login(userName, password);
            history.push('/messages');
        } catch (error) {
            this.props.enqueueSnackbar(error, { variant: "error" });
        }
    }

    render() {
        return (
            <div className={styles.Auth}>
                <img src={logo} alt="Fox" className={styles.logo} />

                <form className={styles.form}>
                    <Typography variant="h3" color="primary" align="left">
                        Fox mailer
                    </Typography>

                    <TextField fullWidth
                        label="Username"
                        margin="dense"
                        name="userName"
                        autoFocus
                        value={this.state.userName}
                        onChange={this.handleChangeTextField}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel htmlFor="login-text-field-password">Password</InputLabel>
                        <Input id="login-text-field-password"
                            type={this.state.showPassword ? 'text' : 'password'}
                            name="password"
                            value={this.state.password}
                            onChange={this.handleChangeTextField}
                            endAdornment={
                                <InputAdornment position="end">
                                    <IconButton
                                        aria-label="toggle password visibility"
                                        onClick={this.handleClickShowPassword}
                                    >
                                        {this.state.showPassword ? <Visibility /> : <VisibilityOff />}
                                    </IconButton>
                                </InputAdornment>
                            }
                        />
                    </FormControl>

                    <div className={styles.button_wrapper}>
                        <Button variant="contained"
                            color="primary"
                            style={{ width: "100%" }}
                            disabled={this.props.isFetching}
                            size="small"
                            onClick={this.login}
                        >
                            Sign in
                        </Button>
                        {this.props.isFetching &&
                            <CircularProgress size={20}
                                className={styles.button_progress}
                            />
                        }
                    </div>

                    <Link to='/signup' className={styles.link}>Sign up</Link>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state: RootState) => ({
    isFetching: state.auth.isFetching,
    error: state.auth.error
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    login: (userName: string, password: string) => dispatch(login(userName, password))
});

export default withSnackbar(connect(mapStateToProps, mapDispatchToProps)(Login));

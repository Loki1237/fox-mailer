import React from 'react';
import styles from './Styles.m.css';
import logo from '../../assets/images/logo.png';

import {
    Button,
    CircularProgress,
    FormControl,
    IconButton,
    Input,
    InputAdornment,
    InputLabel,
    TextField,
    Typography
} from '@material-ui/core';

import { Visibility, VisibilityOff } from '@material-ui/icons';

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { RootState } from '../../store/index';
import { AppThunkDispatch } from '../../store/thunk';
import { login } from '../../store/auth/actions';

interface Props {
    isFetching: boolean,
    error: string,
    login: (userName: string, password: string) => void
}

class Login extends React.Component<Props>  {
    state = {
        firstName: "",
        lastName: "",
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

    render() {
        return (
            <div className={styles.Auth}>
                <img src={logo} alt="Fox" className={styles.logo} />

                <form className={styles.form}>
                    <Typography variant="h3" color="primary" align="left">
                        Fox mailer
                    </Typography>

                    <TextField fullWidth
                        label="First name"
                        margin="dense"
                        name="firstName"
                        autoFocus
                        value={this.state.firstName}
                        onChange={this.handleChangeTextField}
                    />
                    <TextField fullWidth
                        label="Last name"
                        margin="dense"
                        name="lastName"
                        value={this.state.lastName}
                        onChange={this.handleChangeTextField}
                    />
                    <TextField fullWidth
                        label="Username"
                        margin="dense"
                        required
                        name="userName"
                        value={this.state.userName}
                        onChange={this.handleChangeTextField}
                    />
                    <FormControl fullWidth required margin="dense">
                        <InputLabel htmlFor="signup-text-field-password">Password</InputLabel>
                        <Input id="signup-text-field-password"
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
                        >
                            Sign up
                        </Button>
                        {this.props.isFetching &&
                            <CircularProgress size={20}
                                className={styles.button_progress}
                            />
                        }
                    </div>

                    <Link to='/login' className={styles.link}>Cancel</Link>
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

export default connect(mapStateToProps, mapDispatchToProps)(Login);

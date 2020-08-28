import React from 'react';
import styles from './Styles.m.scss';
import logo from '../../assets/images/logo.png';
import { toast as notify } from 'react-toastify';

import { Visibility, VisibilityOff } from '@material-ui/icons';
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

import { Link } from 'react-router-dom';
import { SignupData } from '../../types/authTypes';
import { history } from '../../App';

interface Props {
    screenMode: "full" | "small",
    isFetching: boolean,
    error: string | null,
    signup: (data: SignupData) => void
}

class Signup extends React.Component<Props>  {
    state = {
        firstName: "",
        lastName: "",
        userName: "",
        password: "",
        showPassword: false
    }

    componentDidMount() {
        window.addEventListener("keypress", this.handlePressKeyEnter);
    }

    componentWillUnmount() {
        window.removeEventListener("keypress", this.handlePressKeyEnter);
    }

    handlePressKeyEnter = (e: KeyboardEvent) => {
        if (e.key === "Enter") {
            this.signup();
        }
    }

    handleChangeTextField = (e: React.ChangeEvent<HTMLInputElement>) => {
        this.setState({ [e.target.name]: e.target.value });
    }

    handleClickShowPassword = () => {
        this.setState({ showPassword: !this.state.showPassword });
    }

    signup = async () => {
        const { firstName, lastName, userName, password } = this.state;

        if (!firstName) {
            notify.warn("Please, enter your first name");
            return;
        } else if (firstName && !userName) {
            notify.warn("Please, enter your username");
            return;
        } else if (firstName && userName && !password) {
            notify.warn("Please, enter your password");
            return;
        }

        try {
            await this.props.signup({ firstName, lastName, userName, password });
            notify.success(`${userName} is registered`);
            history.push('/login');
        } catch (e) {
            notify.error(e.message);
        }
    }

    render() {
        return (
            <div className={styles.Auth}>
                {this.props.screenMode === "full" && <img src={logo} alt="Fox" className={styles.logo} />}

                <form className={styles.form}>
                    <div className={styles.header}>
                        {this.props.screenMode === "small" && <img src={logo} alt="Fox" className={styles.logo_small} />}
                        <Typography variant="h3" color="primary" align="left">
                            Fox mailer
                        </Typography>
                    </div>

                    <TextField fullWidth
                        label="First name"
                        margin="dense"
                        required
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
                            onClick={this.signup}
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

export default Signup;

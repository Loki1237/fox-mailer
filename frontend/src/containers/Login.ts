import { connect } from 'react-redux';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import { login } from '../actions/authActions';
import { LoginData } from '../types/authTypes';
import Login from '../components/Auth/Login';

const mapStateToProps = (state: RootState) => ({
    screenMode: state.app.screenMode,
    isFetching: state.auth.isFetching,
    error: state.auth.error
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    login: (data: LoginData) => dispatch(login(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);


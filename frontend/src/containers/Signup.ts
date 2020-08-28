import { connect } from 'react-redux';
import { RootState } from '../store';
import { AppThunkDispatch } from '../store/thunk';
import { signup } from '../actions/authActions';
import { SignupData } from '../types/authTypes';
import Signup from '../components/Auth/Signup';

const mapStateToProps = (state: RootState) => ({
    screenMode: state.app.screenMode,
    isFetching: state.auth.isFetching,
    error: state.auth.error
});

const mapDispatchToProps = (dispatch: AppThunkDispatch) => ({
    signup: (data: SignupData) => dispatch(signup(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(Signup);

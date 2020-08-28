import { connect } from 'react-redux';
import { RootState } from '../store';
import Main from '../components/Main/Main';

const mapStateToProps = (state: RootState) => ({
    currentConversation: state.conversations.currentConversation,
    screenMode: state.app.screenMode
});

export default connect(mapStateToProps)(Main);

import { combineReducers } from 'redux';
import appReducer from '../reducers/appReducer';
import authReducer from '../reducers/authReducer';
import contactsReducer from '../reducers/contactsReducer';
import conversationsReducer from '../reducers/conversationsReducer';

export const rootReducer = combineReducers({
    app: appReducer,
    auth: authReducer,
    contacts: contactsReducer,
    conversations: conversationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

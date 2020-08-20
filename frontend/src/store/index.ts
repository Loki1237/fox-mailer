import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import contactsReducer from './contacts/reducer';
import conversationsReducer from './conversations/reducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    contacts: contactsReducer,
    conversations: conversationsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

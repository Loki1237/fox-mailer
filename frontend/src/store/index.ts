import { combineReducers } from 'redux';
import authReducer from './auth/reducer';
import contactsReducer from './contacts/reducer';

export const rootReducer = combineReducers({
    auth: authReducer,
    contacts: contactsReducer
});

export type RootState = ReturnType<typeof rootReducer>;

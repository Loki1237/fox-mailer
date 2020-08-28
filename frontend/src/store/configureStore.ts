import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reduxWs from '@giantmachines/redux-websocket';
import reduxWsMessage from '../middleware/reduxWsMessage';
import { rootReducer } from './';

const reduxWebsocket = reduxWs();

export function configureStore() {
    return createStore(rootReducer, applyMiddleware(thunk, reduxWebsocket, reduxWsMessage));
}

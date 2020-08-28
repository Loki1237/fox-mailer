import {
    AppState,
    AppAction,
    APP_SET_SCREEN_MODE
} from '../types/appTypes';

const initialState: AppState = {
    screenMode: "full"
};

export default function(state = initialState, action: AppAction): AppState {
    switch (action.type) {
        case APP_SET_SCREEN_MODE:
            return {
                ...state,
                screenMode: action.payload
            };

        default:
            return state;
    }
}

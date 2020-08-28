import {
    AppAction,
    APP_SET_SCREEN_MODE
} from '../types/appTypes';

export const setAppScreenMode = (payload: "full" | "small"): AppAction => ({
    type: APP_SET_SCREEN_MODE,
    payload
});

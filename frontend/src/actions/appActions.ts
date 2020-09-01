import {
    AppAction,
    ScreenMode,
    APP_SET_SCREEN_MODE
} from '../types/appTypes';

export const setAppScreenMode = (payload: ScreenMode): AppAction => ({
    type: APP_SET_SCREEN_MODE,
    payload
});

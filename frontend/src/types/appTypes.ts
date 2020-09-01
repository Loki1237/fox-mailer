export const APP_SET_SCREEN_MODE = "APP_SET_SCREEN_MODE";

export enum ScreenMode {
    FULL = "FULL",
    SMALL = "SMALL"
}

interface SetScreenMode {
    type: typeof APP_SET_SCREEN_MODE,
    payload: ScreenMode
}

export type AppAction = SetScreenMode;

export interface AppState {
    screenMode: ScreenMode
}

export const APP_SET_SCREEN_MODE = "APP_SET_SCREEN_MODE";

interface SetScreenMode {
    type: typeof APP_SET_SCREEN_MODE,
    payload: "full" | "small"
}
export type AppAction = SetScreenMode;

export interface AppState {
    screenMode: "full" | "small"
}

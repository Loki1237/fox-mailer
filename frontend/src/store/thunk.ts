import { Action, AnyAction, Dispatch } from 'redux';
import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { RootState } from './index';

export type AppThunkAction<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
export type AppThunkDispatch = ThunkDispatch<RootState, Dispatch, AnyAction>;

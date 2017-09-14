// @flow
import type { SettingAction, Settings } from '../types';

export const SET_TIMEOUT = 'kafka-rest/settings/timeout-set';
export const CLEAR = 'kafka-rest/settings/clear';
export const ERROR = 'kafka-rest/settings/error';

export default function reducer(
  state :Settings = { url: 'http://localhost:8082/', timeout: 2000, error: '' },
  action: SettingAction) {
  switch (action.type) {
    case SET_TIMEOUT: {
      return {
        ...state,
        timeout: action.timeout || 2000,
      };
    }

    case ERROR: {
      return {
        ...state,
        error: action.message.message,
      };
    }

    case CLEAR: {
      return {
        ...state,
        error: null,
      };
    }

    default:
      return state;
  }
}

export const setTimeout = (timeout :number) => ({
  type: SET_TIMEOUT,
  timeout,
});

export const clear = () => ({
  type: CLEAR,
});

export const error = (message :Error) => ({
  type: ERROR,
  message,
});

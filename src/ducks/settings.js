// @flow
import type { SettingAction, Settings } from '../types';

export const SET_TIMEOUT = 'kafka-rest/settings/set-timeout';
export const SET_WINDOW = 'kafka-rest/settings/set-window';
export const SET_URL = 'kafka-rest/settings/set-url';
export const SET_TAB_INDEX = 'kafka-rest/settings/set-tab-index';
export const CLEAR = 'kafka-rest/settings/clear';
export const ERROR = 'kafka-rest/settings/error';

export default function reducer(
  state :Settings = { url: 'http://localhost:8082/', timeout: 2000, window: 100, tabIndex: 0, error: '' },
  action: SettingAction) {
  switch (action.type) {
    case SET_TIMEOUT: {
      return {
        ...state,
        timeout: action.timeout || 2000,
      };
    }

    case SET_WINDOW: {
      return {
        ...state,
        window: action.window || 100,
      };
    }

    case SET_URL: {
      return {
        ...state,
        url: action.url || 'http://localhost:8082/',
      };
    }

    case SET_TAB_INDEX: {
      return {
        ...state,
        tabIndex: action.tabIndex || 0,
      };
    }
    case ERROR: {
      return {
        ...state,
        error: action.message,
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

export const setRequestTimeout = (timeout :number) => ({
  type: SET_TIMEOUT,
  timeout,
});

export const setWindow = (window :number) => ({
  type: SET_WINDOW,
  window,
});

export const setUrl = (url :string) => ({
  type: SET_URL,
  url,
});

export const setTabIndex = (tabIndex :number) => ({
  type: SET_TAB_INDEX,
  tabIndex,
});

export const clear = () => ({
  type: CLEAR,
});

export const error = (message :Error) => {
  let errorMessage = '';
  if (message && message.stack) {
    errorMessage = message.toString() + message.stack.toString();
  } else if (message) {
    errorMessage.toString();
  }

  return {
    type: ERROR,
    message: errorMessage,
  };
};

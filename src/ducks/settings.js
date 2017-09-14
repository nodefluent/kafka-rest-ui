// @flow
import type { SettingAction, Settings } from '../types';

export const TIMEOUT_SET = 'kafka-rest/settings/timeout-set';
export const ERROR = 'kafka-rest/settings/error';

export default function reducer(state :Settings = { url: 'http://localhost:8082/', timeout: 2000, error: '' }, action: SettingAction) {
  switch (action.type) {
    case TIMEOUT_SET: {
      return {
        ...state,
        timeout: action.timeout || 2000,
      };
    }
    case ERROR: {
      return {
        ...state,
        error: JSON.stringify(action.message, null, 2),
      };
    }

    default:
      return state;
  }
}

export const setTimeout = (event :any) => {
  let timeout = 2000;
  if (event.target.validity.valid) {
    timeout = event.target.value;
  }

  return {
    type: TIMEOUT_SET,
    timeout,
  };
};
export const error = (message :Error) => ({
  type: ERROR,
  message,
});

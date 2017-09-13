// @flow
import type { TopicAction, Topics } from '../types';

export const MOUNTED = 'kafka-rest/topics/mounted';
export const RECEIVED = 'kafka-rest/topics/received';
export const ERROR = 'kafka-rest/topics/error';

export default function reducer(state :Topics = { list: [], loading: false, error: '' }, action: TopicAction) {
  console.log('reducer', action, state);
  switch (action.type) {
    case RECEIVED: {
      return {
        ...state,
        list: action.payload || [],
        loading: false,
      };
    }
    case MOUNTED: {
      return {
        ...state,
        loading: true,
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

export const mounted = () => ({
  type: MOUNTED,
});

export const error = (message :Error) => ({
  type: ERROR,
  message,
});

export const received = (payload: any) => ({
  type: RECEIVED,
  payload,
});

// @flow
import type { TopicAction, Topics } from '../types';

export const MOUNTE = 'kafka-rest/topics/mounte';
export const RECEIVE = 'kafka-rest/topics/receive';
export const ERROR = 'kafka-rest/topics/error';
export const CLEAR = 'kafka-rest/topics/clear';

export default function reducer(state :Topics = { list: [], loading: false, error: '' }, action: TopicAction) {
  switch (action.type) {
    case RECEIVE: {
      return {
        ...state,
        list: action.payload || [],
        loading: false,
      };
    }
    case MOUNTE: {
      return {
        ...state,
        loading: true,
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

export const mounted = () => ({
  type: MOUNTE,
});

export const error = (message :Error) => ({
  type: ERROR,
  message,
});

export const clear = () => ({
  type: CLEAR,
});

export const received = (payload: any) => ({
  type: RECEIVE,
  payload,
});

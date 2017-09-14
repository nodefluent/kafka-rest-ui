// @flow
import type { ConsumerAction, Consumers } from '../types';

export const CREATE = 'kafka-rest/consumers/create';
export const DELETE = 'kafka-rest/consumers/delete';
export const GET_RECORDS = 'kafka-rest/consumers/get-records';
export const UPDATE_RECORDS = 'kafka-rest/consumers/update-records';
export const SUBSCRIBE = 'kafka-rest/consumers/subscribe';
export const SET_TIMEOUT = 'kafka-rest/consumers/set-timeout';
export const ERROR = 'kafka-rest/consumers/error';
export const CLEAR = 'kafka-rest/consumers/clear';

export default function reducer(
  state : Consumers = { list: {}, records: [], loading: false, progress: '', error: '' },
  action :ConsumerAction) {
  switch (action.type) {
    case CREATE: {
      return {
        ...state,
      };
    }

    case DELETE: {
      const newState = Object.assign({}, state);
      delete newState.list[action.consumerId];
      return {
        ...newState,
        loading: false,
        progress: 'Delete consumer...',
      };
    }

    case GET_RECORDS: {
      return {
        ...state,
        progress: 'Getting records...',
      };
    }

    case UPDATE_RECORDS: {
      return {
        ...state,
        records: action.records || [],
      };
    }

    case SUBSCRIBE: {
      return {
        ...state,
        loading: true,
        list: {
          ...state.list,
          [action.consumerId]: {
            topicName: action.topicName,
          },
        },
        progress: `Subscribe to topic ${action.topicName || ''} ...`,
      };
    }

    case ERROR: {
      return {
        ...state,
        loading: false,
        progress: '',
        error: action.message.message,
      };
    }

    case CLEAR: {
      return {
        ...state,
        error: null,
        progress: '',
      };
    }

    default:
      return state;
  }
}

export const created = (topicId :string, parent :string) => {
  const topicName = topicId.replace(`${parent}/`, '');
  const consumerId = `consumer_${topicName}_${new Date().toISOString()}`;
  return {
    type: CREATE,
    consumerId,
    topicName,
  };
};

export const deleted = (consumerId :string, topicName :string) => ({
  type: DELETE,
  consumerId,
  topicName,
});

export const updateRecords = (data :any) => ({
  type: UPDATE_RECORDS,
  records: data,
});

export const gotRecords = (consumerId :string, topicName :string, payload :any) => ({
  type: GET_RECORDS,
  consumerId,
  topicName,
  payload,
});

export const subscribed = (consumerId :string, topicName :string) => ({
  type: SUBSCRIBE,
  consumerId,
  topicName,
});


export const clear = () => ({
  type: CLEAR,
});

export const error = (message :Error) => ({
  type: ERROR,
  message,
});

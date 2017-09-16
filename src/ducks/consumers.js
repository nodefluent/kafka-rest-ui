// @flow
import type { ConsumerAction, Consumers } from '../types';

export const CREATE = 'kafka-rest/consumers/create';
export const DELETE = 'kafka-rest/consumers/delete';
export const GET_RECORDS = 'kafka-rest/consumers/get-records';
export const UPDATE_RECORDS = 'kafka-rest/consumers/update-records';
export const SUBSCRIBE = 'kafka-rest/consumers/subscribe';
export const SET_TIMEOUT = 'kafka-rest/consumers/set-timeout';
export const SET_PAGE = 'kafka-rest/consumers/set-page';
export const ERROR = 'kafka-rest/consumers/error';
export const CLEAR = 'kafka-rest/consumers/clear';

export default function reducer(
  state : Consumers = { list: [], records: [], loading: false, page: 0, progress: '', error: '' },
  action :ConsumerAction) {
  switch (action.type) {
    case CREATE: {
      const newState = Object.assign({}, state);
      newState.list.push({
        consumerId: action.consumerId,
        topicName: action.topicName,
        offset: action.offset,
        status: 'created',
      });
      return newState;
    }

    case DELETE: {
      const newState = Object.assign({}, state);
      newState.list.map((consumer) => {
        if (consumer.consumerId === action.consumerId) {
          consumer.status = 'deleted'; // eslint-disable-line
        }
        return consumer;
      });

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
      const newState = Object.assign({}, state);
      newState.loading = true;
      newState.progress = `Subscribe to topic ${action.topicName || ''} ...`;
      newState.list.map((consumer) => {
        if (consumer.consumerId === action.consumerId) {
          consumer.status = 'subscribed'; // eslint-disable-line
        }
        return consumer;
      });
      return newState;
    }

    case SET_PAGE: {
      return {
        ...state,
        page: (action.page && action.page >= 0) ? action.page : 0,
      };
    }

    case ERROR: {
      return {
        ...state,
        loading: false,
        progress: '',
        error: action.message,
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

export const createConsumer = (topicName :string, offset :string) => {
  const consumerId = `consumer_${topicName}_${new Date().toISOString()}`;
  return {
    type: CREATE,
    consumerId,
    topicName,
    offset,
  };
};

export const deleteConsumer = (consumerId :string, topicName :string) => ({
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

export const subscribe = (consumerId :string, topicName :string) => ({
  type: SUBSCRIBE,
  consumerId,
  topicName,
});

export const setPage = (index :number) => ({
  type: SET_PAGE,
  page: index,
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

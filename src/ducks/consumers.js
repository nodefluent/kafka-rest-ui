// @flow
import type { ConsumerAction, Consumers } from '../types';

export const CREATED = 'kafka-rest/consumers/created';
export const DELETED = 'kafka-rest/consumers/deleted';
export const GOT_RECORDS = 'kafka-rest/consumers/got-records';
export const SUBSCRIBED = 'kafka-rest/consumers/subscribed';
export const ERROR = 'kafka-rest/consumers/error';


export default function reducer(state : Consumers = { list: {}, records: [], loading: false, progress: '', error: '' }, action :ConsumerAction) {
  console.log('reducer consumers', action, state);
  switch (action.type) {
    case CREATED: {
      return {
        ...state,
        loading: true,
        progress: 'Create consumer...',
        list: {
          ...state.list,
          [action.consumerId]: {
            topicName: action.topicName,
          },
        },
      };
    }

    case DELETED: {
      const newState = Object.assign({}, state);
      delete newState.list[action.consumerId];
      return {
        ...newState,
        loading: false,
        progress: 'Delete consumer...',
        records: action.records || [],
      };
    }

    case GOT_RECORDS: {
      return {
        ...state,
        progress: 'Getting records...',
      };
    }

    case SUBSCRIBED: {
      return {
        ...state,
        progress: `Subscribe to topic ${action.topicName || ''} ...`,
      };
    }

    case ERROR: {
      return {
        ...state,
        loading: false,
        progress: '',
        error: JSON.stringify(action.message, null, 2),
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
    type: CREATED,
    consumerId,
    topicName,
  };
};

export const deleted = (consumerId :string, topicName :string, data :any) => ({
  type: DELETED,
  consumerId,
  topicName,
  records: data,
});

export const gotRecords = (consumerId :string, topicName :string, payload :any) => ({
  type: GOT_RECORDS,
  consumerId,
  topicName,
  payload,
});

export const subscribed = (consumerId :string, topicName :string) => ({
  type: SUBSCRIBED,
  consumerId,
  topicName,
});

export const error = (message :Error) => ({
  type: ERROR,
  message,
});

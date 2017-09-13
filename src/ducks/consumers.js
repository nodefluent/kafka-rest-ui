export const CREATED = 'kafka-rest/consumers/created';
export const DELETED = 'kafka-rest/consumers/deleted';
export const GOT_RECORDS = 'kafka-rest/consumers/got-records';
export const SUBSCRIBED = 'kafka-rest/consumers/subscribed';
export const ERROR = 'kafka-rest/consumers/error';

export default function reducer(state = { consumers: [], records: [], loading: false, error: '' }, action) {
  console.log('reducer consumers', action, state);
  switch (action.type) {
    case CREATED: {
      return {
        ...state,
        loading: true,
        consumers: {
          ...state.consumers,
          [action.consumerId]: {
            topicName: action.topicName,
          },
        },
      };
    }

    case DELETED: {
      delete state.consumers[action.consumerId];
      return {
        ...state,
        loading: false,
        records: action.records || [],
      };
    }

    case ERROR: {
      return {
        ...state,
        loading: false,
        error: JSON.stringify(action.message, null, 2),
      };
    }

    default:
      return state;
  }
}

export const created = (topicId, parent) => {
  const topicName = topicId.replace(`${parent}/`, '');
  const consumerId = `consumer_${topicName}_${new Date().toISOString()}`;
  return {
    type: CREATED,
    consumerId,
    topicName,
  };
};

export const deleted = (consumerId, topicName, data) => ({
  type: DELETED,
  consumerId,
  topicName,
  records: data,
});

export const gotRecords = (consumerId, topicName, payload) => ({
  type: GOT_RECORDS,
  consumerId,
  topicName,
  payload,
});

export const subscribed = (consumerId, topicName) => ({
  type: SUBSCRIBED,
  consumerId,
  topicName,
});

export const error = message => ({
  type: ERROR,
  message,
});

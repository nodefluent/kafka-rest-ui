// @flow
import type { TopicAction, Topics } from '../types';

export const GET_TOPIC = 'kafka-rest/topics/get-topic-info';
export const GET_TOPICS = 'kafka-rest/topics/get-topics';
export const RECEIVED = 'kafka-rest/topics/received';
export const TOPIC_RECEIVED = 'kafka-rest/topics/topic-received';
export const ERROR = 'kafka-rest/topics/error';
export const CLEAR = 'kafka-rest/topics/clear';

export default function reducer(
  state :Topics = { list: [], topic: { name: '', partiotions: [], configs: [] }, loading: false, error: '' },
  action: TopicAction) {
  switch (action.type) {
    case RECEIVED: {
      return {
        ...state,
        list: action.payload || [],
        loading: false,
      };
    }
    case GET_TOPICS: {
      return {
        ...state,
        loading: true,
      };
    }

    case GET_TOPIC: {
      return {
        ...state,
        topic: {
          name: action.topic,
          partitions: [],
        },
      };
    }

    case TOPIC_RECEIVED: {
      return {
        ...state,
        topic: {
          ...state.topic,
          configs: action.payload.configs || [],
          partitions: action.payload.partitions || [],
        },
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

export const getTopics = () => ({
  type: GET_TOPICS,
});

export const getTopic = (topic :string) => ({
  type: GET_TOPIC,
  topic,
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

export const clear = () => ({
  type: CLEAR,
});

export const received = (payload: any) => ({
  type: RECEIVED,
  payload,
});

export const topicReceived = (payload: any) => ({
  type: TOPIC_RECEIVED,
  payload,
});

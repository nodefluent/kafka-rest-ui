import { combineEpics } from 'redux-observable';
import { createConsumer, deleteConsumer, getRecords, subscribeToTopic } from './consumers';
import { getTopics } from './topics';

import * as api from '../api';

export default (...args) => combineEpics(
  createConsumer,
  deleteConsumer,
  getRecords,
  getTopics,
  subscribeToTopic,
)(...args, { api });

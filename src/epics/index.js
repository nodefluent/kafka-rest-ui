// @flow
import { combineEpics } from 'redux-observable';
import { createConsumer, deleteConsumer, getRecords, subscribeToTopic } from './consumers';
import { getTopic, getTopics } from './topics';

import * as api from '../api';

export default (...args :any) => combineEpics(
  createConsumer,
  deleteConsumer,
  getRecords,
  getTopic,
  getTopics,
  subscribeToTopic,
)(...args, { api });

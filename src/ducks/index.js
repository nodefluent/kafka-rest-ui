// @flow
import { combineReducers } from 'redux';

import consumers from './consumers';
import topics from './topics';
import settings from './settings';

export default combineReducers({
  consumers,
  topics,
  settings,
});

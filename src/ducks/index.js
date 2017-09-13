import { combineReducers } from 'redux';

import consumers from './consumers';
import topics from './topics';

export default combineReducers({
  consumers,
  topics,
});

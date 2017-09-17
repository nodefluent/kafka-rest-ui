// @flow
import 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { compose, createStore, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import { persistStore, autoRehydrate } from 'redux-persist';
import logger from 'redux-logger';

import './index.css';
import App from './App';

import reducers from './ducks';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

// $FlowIgnore: Type too complex
const store = createStore(reducers, compose(
  applyMiddleware(epicMiddleware, logger),
  autoRehydrate(),
));

persistStore(store);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));

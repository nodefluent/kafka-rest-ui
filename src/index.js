import 'rxjs';
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createEpicMiddleware } from 'redux-observable';
import logger from 'redux-logger';

import './index.css';
import App from './App';

import reducers from './ducks';
import rootEpic from './epics';

const epicMiddleware = createEpicMiddleware(rootEpic);

const store = createStore(reducers, composeWithDevTools(
  applyMiddleware(epicMiddleware, logger),
));
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>, document.getElementById('root'));
// registerServiceWorker();

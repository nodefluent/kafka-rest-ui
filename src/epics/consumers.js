// @flow
import { Observable } from 'rxjs';
import {
  CREATE,
  DELETE,
  SUBSCRIBE,
  GET_RECORDS,
  deleteConsumer as deleteConsumerAction,
  gotRecords,
  updateRecords,
  subscribe,
  error,
} from '../ducks/consumers';
import { getTopic } from '../ducks/topics';
import type { ConsumerAction } from '../types';

export function createConsumer(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(CREATE)
    .filter(() => !store.getState().loading)
    .switchMap((action) => {
      const state = store.getState();
      return Observable.fromPromise(api.createConsumer(
        state.settings.url,
        state.settings.timeout,
        action.consumerId,
        action.offset,
        state.settings.window))
        .switchMap(() => Observable.of(getTopic(action.topicName), subscribe(action.consumerId, action.topicName)));
    })
    .catch(err => Observable.of(error(err)));
}

export function deleteConsumer(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(DELETE)
    .switchMap((action) => {
      const state = store.getState();
      return api.deleteConsumer(state.settings.url, state.settings.timeout, action.consumerId, action.topicName);
    })
    .switchMap(() => Observable.empty())
    .catch(err => Observable.of(error(err)));
}

export function subscribeToTopic(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(SUBSCRIBE)
    .switchMap((action) => {
      const state = store.getState();
      return api.subscribeToTopic(state.settings.url, state.settings.timeout, action.consumerId, action.topicName)
        .then(({ data }) => gotRecords(action.consumerId, action.topicName, data));
    })
    .catch(err => Observable.of(error(err)));
}

export function getRecords(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(GET_RECORDS)
    .switchMap((action) => {
      const state = store.getState();
      return Observable.fromPromise(
        api.getRecords(state.settings.url, state.settings.timeout, action.consumerId, action.topicName))
        .switchMap(({ data }) =>
          Observable.of(updateRecords(data), deleteConsumerAction(action.consumerId, action.topicName)));
    })
    .catch(err => Observable.of(error(err)));
}

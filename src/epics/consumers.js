// @flow
import { Observable } from 'rxjs';
import { CREATED, DELETED, SUBSCRIBED, GOT_RECORDS, deleted, gotRecords, subscribed, error } from '../ducks/consumers';
import type { ConsumerAction } from '../types';

export function createConsumer(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(CREATED)
    .switchMap((action) => {
      const state = store.getState();
      return api.createConsumer(state.settings.url, state.settings.timeout, action.consumerId, action.offset)
        .then(() => subscribed(action.consumerId, action.topicName));
    })
    .catch(err => Observable.of(error(err)));
}

export function deleteConsumer(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(DELETED)
    .switchMap((action) => {
      const state = store.getState();
      return api.deleteConsumer(state.settings.url, state.settings.timeout, action.consumerId, action.topicName);
    })
    .switchMap(() => Observable.empty())
    .catch(err => Observable.of(error(err)));
}

export function subscribeToTopic(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(SUBSCRIBED)
    .switchMap((action) => {
      const state = store.getState();
      return api.subscribeToTopic(state.settings.url, state.settings.timeout, action.consumerId, action.topicName)
        .then(({ data }) => gotRecords(action.consumerId, action.topicName, data));
    })
    .catch(err => Observable.of(error(err)));
}

export function getRecords(action$ :any, store :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(GOT_RECORDS)
    .switchMap((action) => {
      const state = store.getState();
      return api.getRecords(state.settings.url, state.settings.timeout, action.consumerId, action.topicName)
        .then(({ data }) => deleted(action.consumerId, action.topicName, data));
    })
    .catch(err => Observable.of(error(err)));
}

// @flow
import { Observable } from 'rxjs';
import { CREATED, DELETED, SUBSCRIBED, GOT_RECORDS, deleted, gotRecords, subscribed, error } from '../ducks/consumers';
import type { ConsumerAction } from '../types';

export function createConsumer(action$ :any, _ :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(CREATED)
    .switchMap(action => api.createConsumer(action.consumerId, action.offset)
      .then(() => subscribed(action.consumerId, action.topicName)))
    .catch(err => Observable.of(error(err)));
}

export function deleteConsumer(action$ :any, _ :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(DELETED)
    .switchMap(action => api.deleteConsumer(action.consumerId, action.topicName))
    .switchMap(() => Observable.empty())
    .catch(err => Observable.of(error(err)));
}

export function subscribeToTopic(action$ :any, _ :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(SUBSCRIBED)
    .switchMap(action => api.subscribeToTopic(action.consumerId, action.topicName)
      .then(({ data }) => gotRecords(action.consumerId, action.topicName, data)))
    .catch(err => Observable.of(error(err)));
}

export function getRecords(action$ :any, _ :any, { api } :any) :Observable<ConsumerAction> {
  return action$.ofType(GOT_RECORDS)
    .switchMap(action => api.getRecords(action.consumerId, action.topicName)
      .then(({ data }) => deleted(action.consumerId, action.topicName, data)))
    .catch(err => Observable.of(error(err)));
}

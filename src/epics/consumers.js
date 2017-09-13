import { Observable } from 'rxjs';
import { CREATED, DELETED, SUBSCRIBED, GOT_RECORDS, deleted, gotRecords, subscribed, error } from '../ducks/consumers';

export function createConsumer(action$, _, { api }) {
  return action$.ofType(CREATED)
    .switchMap(action => api.createConsumer(action.consumerId, action.offset)
      .then(data => subscribed(action.consumerId, action.topicName, data)))
    .catch(err => Observable.of(error(err)));
}

export function deleteConsumer(action$, _, { api }) {
  return action$.ofType(DELETED)
    .switchMap(action => api.deleteConsumer(action.consumerId, action.topicName))
    .switchMap(() => Observable.empty())
    .catch(err => Observable.of(error(err)));
}

export function subscribeToTopic(action$, _, { api }) {
  return action$.ofType(SUBSCRIBED)
    .switchMap(action => api.subscribeToTopic(action.consumerId, action.topicName)
      .then(({ data }) => gotRecords(action.consumerId, action.topicName, data)))
    .catch(err => Observable.of(error(err)));
}

export function getRecords(action$, _, { api }) {
  return action$.ofType(GOT_RECORDS)
    .switchMap(action => api.getRecords(action.consumerId, action.topicName)
      .then(({ data }) => deleted(action.consumerId, action.topicName, data)))
    .catch(err => Observable.of(error(err)));
}

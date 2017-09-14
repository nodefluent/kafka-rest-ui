// @flow
import { Observable } from 'rxjs';
import { GET_TOPIC, GET_TOPICS, received, topicReceived, error } from '../ducks/topics';

export function getTopics(action$ :any, store :any, { api } :any) {
  return action$.ofType(GET_TOPICS)
    .filter(() => !store.getState().loading)
    .switchMap(() => {
      const state = store.getState();
      return api.getTopics(state.settings.url, state.settings.timeout);
    })
    .map(({ data }) => received(data))
    .catch(err => Observable.of(error(err)));
}

export function getTopic(action$ :any, store :any, { api } :any) {
  return action$.ofType(GET_TOPIC)
    .switchMap((action) => {
      if (!action.topic) {
        return Observable.empty();
      }
      const state = store.getState();
      return api.getTopic(state.settings.url, state.settings.timeout, action.topic);
    })
    .map(({ data }) => topicReceived(data))
    .catch(err => Observable.of(error(err)));
}

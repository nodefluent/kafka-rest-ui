// @flow
import { Observable } from 'rxjs';
import { MOUNTE, received, error } from '../ducks/topics';

export function getTopics(action$ :any, store :any, { api } :any) {
  return action$.ofType(MOUNTE)
    .switchMap(() => {
      const state = store.getState();
      return api.getTopics(state.settings.url, state.settings.timeout);
    })
    .map(({ data }) => received(data))
    .catch(err => Observable.of(error(err)));
}

export function getTopic(action$ :any, store :any, { api } :any) {
  return action$.ofType(MOUNTE)
    .switchMap(() => {
      const state = store.getState();
      return api.getTopic(state.settings.url, state.settings.timeout);
    })
    .map(({ data }) => received(data))
    .catch(err => Observable.of(error(err)));
}

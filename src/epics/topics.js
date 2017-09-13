import { Observable } from 'rxjs';
import { MOUNTED, received, error } from '../ducks/topics';

export function getTopics(action$, _, { api }) {
  return action$.ofType(MOUNTED)
    .switchMap(api.getTopics)
    .map(({ data }) => received(data))
    .catch(err => Observable.of(error(err)));
}

export function getTopic(action$, _, { api }) {
  return action$.ofType(MOUNTED)
    .switchMap(api.getTopic)
    .map(({ data }) => received(data))
    .catch(err => Observable.of(error(err)));
}

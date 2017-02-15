import { createSelector } from 'redux-orm';
import orm from '../orm';

export function select(id) {
  return (state) => orm.session(state.orm).Vocaloid.withId(id);
}

export default createSelector(orm, session => {
    return session;
});

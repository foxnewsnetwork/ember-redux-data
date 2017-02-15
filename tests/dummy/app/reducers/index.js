import orm from '../orm';
import updater from 'ember-redux-data/updaters/model';
import { createReducer } from 'redux-orm';

export default {
  orm: createReducer(orm, updater)
}

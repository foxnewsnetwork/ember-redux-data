import ownKeys from './own-keys';
import Actions from '../actions/model';

function add(f, g) {
  return (x) => { f(x); g(x); };
}

const NOOP = () => {};

function thunkify(modelName, data) {
  return (dispatch) => ownKeys(data)
    .map((id) => Actions.createModel(modelName, data[id]))
    .map(dispatch);
}

export default function thunkifyEntities(entities) {
  return ownKeys(entities)
    .map((modelName) => thunkify(modelName, entities[modelName]))
    .reduce(add, NOOP);
}

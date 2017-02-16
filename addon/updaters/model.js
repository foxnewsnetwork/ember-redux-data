import Actions from '../actions/model';
import modelName from '../utils/model-name';

const NOOP = () => {};
const NULL_MODEL = {
  update: NOOP,
  create: NOOP,
  withId: () => NULL_MODEL,
  delete: NOOP,
  hasId: NOOP,
  get: NOOP
};
function createOrUpdate(Model, data) {
  const id = data[Model.idAttribute];
  if(Model.hasId(id)) {
    Model.update(data);
  } else {
    Model.create(data);
  }
}

export const ModelUpdater = {
  [Actions.ormCreateOrUpdateModel](Model, { payload }) {
    const { data } = payload;
    createOrUpdate(Model, data);
  },
  [Actions.ormDestroyModel](Model, { payload }) {
    const { data } = payload;
    Model.withId(data).delete();
  }
}

function get(obj, key, defaultResult) {
  if(obj && typeof obj === 'object' && typeof key === 'string') {
    return obj[key] || defaultResult;
  } else {
    return defaultResult;
  }
}
function findModel(session, payload) {
  const ModelClass = modelName(get(payload, 'ModelClass'));
  return get(session, ModelClass, NULL_MODEL);
}

export default function update(session, action) {
  const fn = get(ModelUpdater, action.type, NOOP);
  const Model = findModel(session, action.payload);

  return fn(Model, action);
}

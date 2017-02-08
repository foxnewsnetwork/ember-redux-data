import Actions from '../actions/model';

const NOOP = () => {};

function createOrUpdate(Model, data) {
  const id = data[Model.idAttribute];
  if(Model.hasId(id)) {
    Model.update(data);
  } else {
    Model.create(data);
  }
}

export const ModelUpdater = {
  [Actions.ormCreateOrUpdateModel]({ payload }, Model) {
      const { ModelClass, data } = payload;

      if(modelName(ModelClass) === Model.modelName) {
        createOrUpdate(Model, data);
      }
    },
  [Actions.ormDestroyModel]({ payload }, Model) {
    const { ModelClass, data } = payload;

    if(modelName(ModelClass) === Model.modelName) {
      Model.withId(data).delete();
    }
  }
};

export default function update(session, action) {
  const fn = ModelUpdater[action.type] || NOOP;
  return fn(session, action);
};

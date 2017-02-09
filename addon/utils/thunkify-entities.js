import ownKeys from './own-keys';
import Actions from '../actions/model';

function add(f, g) {
  return (x) => { f(x); g(x); };
}

const NOOP = () => {};

function thunkify(modelName, data) {
  return (dispatch) => ownKeys(data)
    .map((id) => Actions.ormCreateModel(modelName, data[id]))
    .map(dispatch);
}

/**
Here's an example of what entities should look like:

const entities = {
  "articles": {
      "123": {
        id: "123",
        author: "1",
        title: "My awesome blog post",
        comments: [ "324" ]
      }
    },
    "users": {
      "1": { "id": "1", "name": "Paul" },
      "2": { "id": "2", "name": "Nicole" }
    },
    "comments": {
      "324": { id: "324", "commenter": "2" }
    }
  }
};
*/
export default function thunkifyEntities(entities) {
  return ownKeys(entities)
    .map((modelName) => thunkify(modelName, entities[modelName]))
    .reduce(add, NOOP);
}

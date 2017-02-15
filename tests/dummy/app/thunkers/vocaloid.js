import thunkJSONAPI from 'ember-redux-data/thunkers/jsonapi';

function someTransform(response) {
  return response;
}

export default function toThunk(response) {
  return thunkJSONAPI(someTransform(response));
}

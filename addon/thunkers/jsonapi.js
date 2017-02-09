import Ember from 'ember';
import mapValue from '../utils/map-value';

const { typeOf } = Ember;
const NOOP = () => {};
/**
What's a thunker?

A thunker is a much like ember-data's serializer... only, instead of taking an
input json and outputting a json, it takes an input json and outputs a "thunk"
function that, when dispatch to redux, populates the redux-orm store.

Think of it as a way to batch actions.

Read about json-api here: http://jsonapi.org/
*/

export default function thunkJSONAPI(jsonapiResponse) {
  const { data, included } = jsonapiResponse;
  return mergeTypes(dataToEntites(data), includedToEntities(included));
}

function mergeTypes() {
  
}

function includedToEntities(included) {

}

const DataEntitifers = {
  array(dataArr) {

  },
  object(dataObj) {
    const { type, id, attributes, relationships } = dataObj;
    return {
      [type]: {
        [id]: {
          ...attributes,
          ...mapValue(relationships, relationshipsToId);
        }
      }
    };
  },
  null: NOOP
}

const IDExtractor = {
  object({id}) { return id; },
  array(objects) { return fmap(objects, IDExtractor.object); },
  null: NOOP
};

function relationshipsToId(data) {
  return IDExtractor[typeOf(data)](data);
}

function dataToEntites(data) {

}

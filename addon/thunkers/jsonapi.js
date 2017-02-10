import Ember from 'ember';
import thunkifyEntities from '../utils/thunkify-entities';
import mapValues from '../utils/map-values';
import mergeObjects from '../utils/merge-objects';
import camelizeKeys from '../utils/camelize-keys';

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
  return thunkifyEntities(toEntities(jsonapiResponse));
}

export function toEntities(jsonapiResponse) {
  const { data, included } = jsonapiResponse;
  const dataEntities = dataToEntites(data);
  const includedEntitles = includedToEntities(included || []);

  return mergeObjects(dataEntities, includedEntitles);
}

function includedToEntities(included) {
  return included.reduce((entities, data) => mergeObjects(entities, dataToEntites(data), mergeObjects), {});
}

const DataEntitifers = {
  array(dataArr) {
    return dataArr.reduce((out, data) => mergeObjects(out, DataEntitifers.object(data)), {});
  },
  object(dataObj) {
    const { type, id, attributes = {}, relationships = {} } = dataObj;
    const dataAttrs = camelizeKeys(attributes);
    const relationAttrs = camelizeKeys(mapValues(relationships, relationshipsToId));
    const allAttrs = { id, ...relationAttrs, ...dataAttrs };

    return { [type]: { [id]: allAttrs } };
  },
  null: NOOP
}

const IDExtractor = {
  object({id}) { return id; },
  array(objects) { return objects.map(IDExtractor.object); },
  null: NOOP
};

function relationshipsToId({ data }) {
  return IDExtractor[typeOf(data)](data);
}

function dataToEntites(data) {
  return DataEntitifers[typeOf(data)](data);
}

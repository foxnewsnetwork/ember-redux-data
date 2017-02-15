import { thunkifyEntities } from 'ember-redux-data/utils/thunkify-entities';

export function toEntities(remoteResponse) {
  // Transform the server response here
  return {};
}

export default function toThunk(remoteResponse) {
  return thunkifyEntities(toEntities(remoteResponse));
}

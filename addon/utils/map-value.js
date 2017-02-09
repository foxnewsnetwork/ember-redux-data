import Ember from 'ember';
import ownKeys from './own-keys';

const { get, set } = Ember;

export default function mapValue(hash, fn) {
  return ownKeys(hash).reduce((output, key) => set(output, key, fn(get(hash, key), key)), {});
}

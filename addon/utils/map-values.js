import Ember from 'ember';
import ownKeys from './own-keys';
import set from './object-set';

const { get } = Ember;

export default function mapValues(hash, fn) {
  return ownKeys(hash).reduce((output, key) => set(output, key, fn(get(hash, key), key)), {});
}

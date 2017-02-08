import Ember from 'ember';
import ownKeys from './own-keys';

const { getWithDefault, typeOf, get, set, String: { camelize } } = Ember;

const CAMELIZER_ASSIGNERS = {
  DEFAULT(output, key, value) {
    set(output, camelize(key), value);
    return output;
  },
  object(output, key, nestedObj) {
    set(output, camelize(key), camelizeKeys(nestedObj));
    return output;
  },
  array(output, key, arrayObj) {
    set(output, camelize(key), arrayObj.map(camelizeKeys));
    return output;
  }
}

const CAMELIZERS = {
  primitive(value) { return value; },
  array(array) { return array.map(camelizeKeys); },
  object(hash) {
    return ownKeys(hash).reduce((output, key) => {
      const value = get(hash, key);
      const camelizer = getWithDefault(CAMELIZER_ASSIGNERS, typeOf(value), CAMELIZER_ASSIGNERS.DEFAULT);
      return camelizer(output, key, value);
    }, {});
  }
};

export default function camelizeKeys(x) {
  const camelizer = getWithDefault(CAMELIZERS, typeOf(x), CAMELIZERS.primitive);
  return camelizer(x);
}

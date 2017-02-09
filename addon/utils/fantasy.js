import Ember from 'ember';
import ownKeys from './own-keys';
const { typeOf } = Ember;

/**
Ramda and whatnot doesn't extend prototype, so we'll have to make do with array

- Applicative
- Functor
- Monoid
- Foldable
- Plus

*/
class List {
  static of(x) { return x; }

  static ap(list, flist) {
    return list.map((member) => flist.map((f, i) => f(member)));
  }

  static fmap(list, f) {
    return list.map(f);
  }

  static empty() {
    return [];
  }

  static reduce(list, rf, initial) {
    return list.reduce(rf, initial);
  }
}

function set(hash, key, value) {
  return { ...hash, [key]: value };
}

class Hash {
  static of(x) { return x; }
  static fmap(hash, f) {
    return ownKeys(hash).reduce((output, key) => set(output, key, f(hash[key])), {});
  }
  static ap(hash, fhash) {
    return Hash.fmap(hash, (value, key) => Hash.fmap(fhash, (fval, fkey) =>  ))
  }
}

const TypeAssign = {
  array: List,
  object: Hash,
  instance: EmberObject,
  null: Nothing
}

export function liftA(x) {
  return TypeAssign[typeOf(x)].of(x);
}

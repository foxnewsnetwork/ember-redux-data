import ownKeys from './own-keys';
import set from './object-set';
function reduce(hash, fn, init) {
  const keys = ownKeys(hash);
  return keys.reduce((output, key) => {
    return fn(output, hash[key], key);
  }, init);
}

export default function mergeObjects(foldA, foldB, fn=Object.assign) {
  return reduce(foldA, (output, value, key) => {
    if(key in output) {
      const newVal = fn(value, output[key], key);
      return set(output, key, newVal);
    } else {
      return set(output, key, value);
    }
  }, foldB)
}

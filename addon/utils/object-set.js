export default function set(obj, key, val) {
  return Object.assign({}, obj, {[key]: val});
}

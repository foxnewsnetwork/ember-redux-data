const trimSep = (str) => str.replace(/^\/+/, '').replace(/\/+$/, '');
const isBlank = (str) => typeof str === 'string' && str.match(/\S/) === null
const isPresent = (str) => !isBlank(str);

export default function pathJoin(...parts){
  return parts
    .map(trimSep)
    .filter(isPresent)
    .join('/');
}

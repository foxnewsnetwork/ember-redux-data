export default function modelName(x) {
  switch(typeof x) {
    case 'object':
      return x.modelName;
    default:
      return x;
  }
}

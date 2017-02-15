import { Model, attr, fk } from 'redux-orm';

export default class Dress extends Model {
  static get modelName() {
    return 'Dress';
  }

  static get fields() {
    return {
      /**
      * Attribute Fields
      */
      nickname: attr({ type: 'string' }),
      /**
      * Relationship Fields
      */
      wornBy: fk('Vocaloid')
    };
  }
}

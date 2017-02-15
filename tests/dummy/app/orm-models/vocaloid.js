import { Model, attr, many } from 'redux-orm';

export default class Vocaloid extends Model {
  static get modelName() {
    return 'Vocaloid';
  }

  static get fields() {
    return {
      /**
      * Attribute Fields
      */
      name: attr({ type: 'string' }),
      /**
      * Relationship Fields
      */
      dresses: many('Dress')
    };
  }
}

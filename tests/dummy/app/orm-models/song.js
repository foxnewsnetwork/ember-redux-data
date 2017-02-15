import { Model, attr } from 'redux-orm';

export default class Song extends Model {
  static get modelName() {
    return 'Song';
  }

  static get fields() {
    return {
      /**
      * Attribute Fields
      */
      name: attr({ type: 'string' }),
      bpm: attr({ type: 'number' })
      /**
      * Relationship Fields
      */

    };
  }
}

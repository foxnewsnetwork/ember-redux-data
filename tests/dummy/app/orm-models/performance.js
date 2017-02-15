import { Model, attr, fk } from 'redux-orm';

export default class Performance extends Model {
  static get modelName() {
    return 'Performance';
  }

  static get fields() {
    return {
      /**
      * Attribute Fields
      */
      venue: attr({ type: 'name' }),
      /**
      * Relationship Fields
      */
      song: fk('Song'),
      singer: fk('Vocaloid')
    };
  }
}

import Ember from 'ember';

const { Logger } = Ember;

const m = (x) => `[NullModel#${x}] Tried to make ${x} to nonexistent modelClass: `;

export default class NullModel {
  constructor(modelClass) {
    this.modelClass = modelClass;
    this.objectID = 'no id given';
  }
  update(obj) {
    Logger.warn(m('update'),
      this.modelClass,
      'with id: "',
      this.objectID,
      '" with value: "',
      obj,
      '"');
  }
  create(obj) {
    Logger.warn(m('create'),
      this.modelClass,
      '" with value: "',
      obj,
      '"');
  }
  withId(id) {
    this.objectID = id;
    Logger.warn(m('withId'),
      this.modelClass,
      'with id: "',
      this.objectID,
      '"');
    return this;
  }
  delete() {
    Logger.warn(m('delete'),
      this.modelClass,
      'with id: "',
      this.objectID,
      '"');
  }
  hasId(id) {
    Logger.warn(m('hasId'),
      this.modelClass,
      'with id: "',
      id,
      '"');
  }
  get(params) {
    Logger.warn(m('get'),
      this.modelClass,
      'with params: "',
      params,
      '"');
    return this;
  }
}

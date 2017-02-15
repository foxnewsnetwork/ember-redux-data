import request from 'ember-ajax/request';
import pathJoin from 'ember-redux-data/utils/path-join';

export default class Request {
  static namespace() {
    return 'api';
  }
  static host() {
    return '/';
  }
  static routeName(id) {
    return pathJoin('vocaloid', id);
  }

  findURI(id) {
    return pathJoin(this.constructor.host(), this.constructor.namespace(), this.constructor.routeName(id));
  }
  find(id) {
    return request(this.findURI(id));
  }
}

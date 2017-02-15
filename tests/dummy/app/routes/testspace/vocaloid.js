import Ember from 'ember';
import route from 'ember-redux/route';
import connect from 'ember-redux-route-connect';
import Request from 'dummy/requests/vocaloids';
import toThunk from 'dummy/thunkers/vocaloid';
import { select } from 'dummy/orm-selectors/vocaloids';

const request = new Request();

function model(dispatch, params) {
  return request.find(params.id).then(toThunk).then(dispatch);
}

function computedStates(state, params) {
  const findVocaloid = select(params.id);
  return {
    model: findVocaloid(state)
  };
}

const Route = route({ model })(Ember.Route.extend({}));
export default connect(computedStates)(Route);

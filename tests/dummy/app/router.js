import Ember from 'ember';
import config from './config/environment';

const Router = Ember.Router.extend({
  location: config.locationType,
  rootURL: config.rootURL
});

Router.map(function() {
  this.route('testspace', function() {
    this.route('vocaloid', { path: 'vocaloid/:id' });
  });

  this.route('introduction');
  this.route('basics');
  this.route('advanced');
  this.route('recipes');
});

export default Router;

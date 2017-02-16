/*jshint node:true*/
module.exports = {
  description: 'Installation blueprint for ember-redux-data',
  normalizeEntityName: function() {},

  afterInstall: function(options) {
    return this.addAddonsToProject( {
      packages: [
        { name: 'ember-normalizr-shim', target: '^0.1.2' },
        { name: 'ember-redux-actions', target: '^0.1.1' },
        { name: 'ember-redux-orm', target: '^0.2.1' },
        { name: 'ember-redux', target: '^2.1.0' },
        { name: 'ember-inflector', target: '^1.11.0' }
      ]
    });
  }
};

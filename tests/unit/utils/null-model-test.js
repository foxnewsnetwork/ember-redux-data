import { expect } from 'chai';
import { describe, it } from 'mocha';
import NullModel from 'ember-redux-data/utils/null-model';

describe('Unit | Utility | null model', function() {
  describe('ORM model parity', function() {
    const m0 = new NullModel('Vocaloid');

    it('should have the withId method', () => {
      expect(m0).to.respondTo('withId');
    });
    it('should have the hasId method', () => {
      expect(m0).to.respondTo('hasId');
    });
    it('should have the get method', () => {
      expect(m0).to.respondTo('get');
    });
    it('should have the create method', () => {
      expect(m0).to.respondTo('create');
    });
    it('should have the update method', () => {
      expect(m0).to.respondTo('update');
    });
    it('should have the delete method', () => {
      expect(m0).to.respondTo('delete');
    });
  });
});

import { expect } from 'chai';
import { describe, it } from 'mocha';
import mergeObjects from 'ember-redux-data/utils/merge-objects';

describe('Unit | Utility | merge objects', function() {
  describe('basic functionality', function() {
    const a = { dog: 1, cat: 2 };
    const b = { dog: 5, bat: 4 };
    const actual = mergeObjects(a, b, (a, b) => a + b);

    it('should add on collison', function() {
      expect(actual).to.have.property('dog', 6);
    });

    it('should have non colliding values of a', function() {
      expect(actual).to.have.property('cat', 2);
    });

    it('should have non colliding values of b', () => {
      expect(actual).to.have.property('bat', 4);
    });

    it('should not modify either the original', () => {
      expect(a).to.have.keys('dog', 'cat');
      expect(a).to.not.have.keys('bat');
      expect(b).to.have.keys('dog', 'bat');
      expect(b).to.not.have.keys('cat');
    });
  });
});

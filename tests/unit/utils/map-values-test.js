import { expect } from 'chai';
import { describe, it } from 'mocha';
import mapValues from 'ember-redux-data/utils/map-values';

describe('Unit | Utility | map values', function() {
  const a = { dog: 1, cat: 2, bat: 3 };
  const actual = mapValues(a, (x) => x * 2);

  it('works', () => {
    expect(actual).to.have.all.keys({ dog: 2, cat: 4, bat: 6 });
  });
  it('should not change the original', () => {
    expect(a).to.have.all.keys('dog', 'cat', 'bat');
  });
});

/* global server */
import { describe, it, before, after } from 'mocha';
import { expect } from 'chai';
import startApp from '../helpers/start-app';
import destroyApp from '../helpers/destroy-app';
import Page from '../pages/testspace/vocaloid';

describe('Acceptance | getting data', function() {
  let application;

  before(function(done) {
    application = startApp();
    server.create('vocaloid', { id: 'miku', name: 'miku hatsune' });
    Page.visit({ id: 'miku' });
    andThen(() => { done() });
  });

  after(function() {
    destroyApp(application);
  });

  it('should be on the right page', function() {
    expect(currentPath()).to.equal('testspace.vocaloid');
  });
  it('should have the proper data rendered on page', () => {
    expect(Page.name).to.equal('miku hatsune');
  })
});

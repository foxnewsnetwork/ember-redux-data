import { expect } from 'chai';
import { describe, it, before } from 'mocha';
import { toEntities } from 'ember-redux-data/thunkers/jsonapi';
import fixture from '../../fixtures/jsonapi';

describe('Unit | Thunker | jsonapi', function() {
  describe('sanity', function() {
    it('should be ok', function() {
      expect(toEntities).to.be.a('function');
    });
  });

  describe('basic get-one functionality', function() {
    const jsonapi = {
      data: {
        "type": "articles",
        "id": "1",
        "attributes": {
          "title": "JSON API paints my bikeshed!"
        },
        "relationships": {
          "author": {
            "data": { "type": "people", "id": "9" }
          }
        }
      }
    };

    const actual = toEntities(jsonapi);

    it('should have articles', () => {
      expect(actual).to.have.property('articles');
    });

    describe('articles', function() {
      const { articles } = actual;
      it('should have only 1 article', function() {
        expect(articles).to.have.all.keys("1");
      });

      describe('article', function() {
        const article = articles["1"];

        it('should be the correct article', function() {
          expect(article).to.have.property('id', "1");
        });
        it('should have the right attribute', function() {
          expect(article).to.have.property('title', jsonapi.data.attributes.title);
        });
        it('should have the related id', function() {
          expect(article).to.have.property('author', jsonapi.data.relationships.author.data.id);
        });
      });
    });
  });

  describe('general functionality', function() {
    let entities;
    before(() => {
      entities = toEntities(fixture);
    });

    it('should contain all the entitles in the fixture', () => {
      expect(entities).to.have.all.keys('articles', 'people', 'comments');
    });

    describe('members', function() {
      let articles, people, comments;
      before(() => {
        articles = entities.articles;
        people = entities.people;
        comments = entities.comments;
      });

      it('should have 1 article', () => {
        expect(articles).to.have.all.keys('1');
      });

      it('should have 1 people', () => {
        expect(people).to.have.all.keys('9');
      });

      it('should have 2 comments', () => {
        expect(comments).to.have.all.keys('5', '12');
      });

      describe('person', function() {
        let person;
        before(() => {
          person = people['9'];
        });

        it('should have the properly camelized attribute', () => {
          expect(person).to.have.property('firstName', 'Dan');
          expect(person).to.have.property('lastName', 'Gebhardt');
          expect(person).to.have.property('twitter', 'dgeb');
        });
      });
    });
  });
});

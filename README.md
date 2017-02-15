# ember-redux-data

Blueprints and utilities for using the redux data stack in Ember.js

## Redux Data Stack
Unlike Ember.js which recommends ember-data as your app's go-to data-consistency and remote-io layer (and react which recommends graphQL via relay), redux is lot less opinionated regarding what tools your app should use in this regard.

The purpose of this repo is to expose the tools and usage patterns that I personally found to cleanly and simply solve the problem of front-end data management. The tools used are:

1. redux-actions - for FSA compliance
2. redux-orm - for normalization and data consistency
3. normalizr - for transforming and untransforming server-side responses

## Concepts
Redux is big on functional programming, and, a such, a good data layer for use with redux should expose functions as pure as possible.

#### Remote APIs
Your app should have a `remote-apis/*` directory that describes all the external endpoints your app will be hitting. `remote-api`s should all be functions that return a promise with the external response:

```typesript
run :: (any) -> Promise
```

For example: `app/remote-apis/user.js` might look like:

```javascript
import request from 'ember-ajax/request';

export function find(id) {
  return request(`my/endpoint/users/${id}`);
}
```

In general, keep your remote-api functions as simple and stupid as possible. They shouldn't know about your application at all and so should theoretically be drag-and-droppable into any application.

#### Thunkers
What is a thunker? A thunker is a function that takes an remote response and transforms them into a redux-dispatchable thunk that will populate the redux store

```typescript
type Thunk = (dispatch: Dispatch): Promise

type Thunker = (response: JSON): Thunk
```

Think of such a thunk as a batch of redux-actions.

To follow the convention set aside by redux's normalizr library, all thunkers should have the following form:

`app/thunkers/example.js`
```javascript
export function toEntities(serverResponse) {
  // Do what you need to wrangle the server response
}
export default function exampleThunker(serverResponse) {
  return thunkifyEntities(toEntities(serverResponse));
}
```

`normalizr` normalizes data the following format:
- Input:
```json
{
  "id": "123",
  "author": {
    "id": "1",
    "name": "Paul"
  },
  "title": "My awesome blog post",
  "comments": [
    {
      "id": "324",
      "commenter": {
        "id": "2",
        "name": "Nicole"
      }
    }
  ]
}
```

- Output:
```json
{
  result: "123",
  entities: {
    "articles": {
      "123": {
        id: "123",
        author: "1",
        title: "My awesome blog post",
        comments: [ "324" ]
      }
    },
    "users": {
      "1": { "id": "1", "name": "Paul" },
      "2": { "id": "2", "name": "Nicole" }
    },
    "comments": {
      "324": { id: "324", "commenter": "2" }
    }
  }
}
```
Read about the normalizr here https://github.com/paularmstrong/normalizr

#### Selectors
What is a selector? Selectors are a function that take in the entire redux application state, filters out what is irrelevant for our use case, and returns only what we need. This is best illustrated with an example:

```javascript
import { createSelector } from 'redux-orm';
const selectRetiredAuthors = createSelector(orm, (session) => session.Author.get({ isRetired: true }) );
```

#### Dispatchables
`dispatch`able objects (aka requests) are the bridge between the `Ember.Route` and the outside world. They wrap the API, thunker, and friends so that Ember doesn't have to ever know about the details of the outside world.

`app/requests/find`
```javascript
import userAPI from 'dummy/remote-apis/user';
import { exampleThunker } from 'dummy/thunkers/user';
import ENV from 'dummy/config/environment';

export default const findRequest = (id) => (dispatch) =>
  userAPI.find(id, ENV)
    .then(exampleThunker)
    .then(dispatch));
```

We'll call this `dispatch`able thing a request. From Ember's point of view, `request`s should be opaque generators of IO. Because of this opacity, it's possible for us to switch request implementation strategies easily (e.g. using thunk, saga, or even a for loop)

## How To Use
Request objects serve as the contact point between ember's `model` hook and populating the redux store with data entries.

Consider an example route `dummy/routes/user.js`
```javascript
import route from 'ember-redux/route';
import Ember from 'ember';
import findRequest from 'dummy/requests/find';

const { inject: { service } } = Ember;

function model(dispatch, params) {
  return dispatch(findRequest(params.id));
}
```

#### Accessing Data

And as with all redux apps, you pull data out of the redux store with designated `data-delegate` components like so:

```handlebars
{{#data-delegate-single-user userId=3 as |user|}}
  {{whatever-user-presentation-component user=user}}
{{/data-delegate-single-user}}
```

where your `components/data-delegate-single-user.js` would look like:
```javascript
import connect from 'ember-redux/components/connect';
import Ember from 'ember';
import { find } from 'dummy/orm-selectors/users';

function states(reduxState, attrs) {
  const selectUser = find(attrs.userId);
  const user = selectUser(reduxState);
  return { user };  
}

function actions(dispatch) {
  return {
    something() {
      ...
    }
  };
}
export default connect(states, actions)(Ember.Component.extend({
  tagName: ''
}));
```

## Boilerplate Checklist
In order to setup `ember-redux-data` for the first time, you must do the following:

- [ ] add the orm reducer into your project `app/reducers/index`
```javascript
import orm from 'dummy/orm';
import updater from 'ember-redux-data/updaters/model';
import { createReducer } from 'redux-orm';
import otherReducers from '...';

export default {
  orm: createReducer(orm, updater),
  ...otherReducers
}
```

- [ ] update your `app/orm.js` with your models:
```javascript
import { ORM } from 'redux-orm';
import Dress from './orm-models/dress';
import Performance from './orm-models/performance';
import Song from './orm-models/song';
import Vocaloid from './orm-models/vocaloid';

const orm = new ORM();
orm.register(Dress, Performance, Song, Vocaloid);

export default orm;
```

## Cookbook Recipes

## Installation

* `git clone <repository-url>` this repository
* `cd ember-redux-data`
* `npm install`
* `bower install`

## Running

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).

## Running Tests

* `npm test` (Runs `ember try:each` to test your addon against multiple Ember versions)
* `ember test`
* `ember test --server`

## Building

* `ember build`

For more information on using ember-cli, visit [https://ember-cli.com/](https://ember-cli.com/).

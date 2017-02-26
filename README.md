# ember-redux-data

[![Build Status](https://travis-ci.org/foxnewsnetwork/ember-redux-data.svg?branch=master)](https://travis-ci.org/foxnewsnetwork/ember-redux-data)

Blueprints and utilities for using the redux data stack in Ember.js

# WIP! Work in Progress!

## Redux Data Stack
Unlike Ember.js which recommends ember-data as your app's go-to data-consistency and remote-io layer (and react which recommends graphQL via relay), redux is lot less opinionated regarding what tools your app should use in this regard.

The purpose of this repo is to expose the tools and usage patterns that I personally found to cleanly and simply solve the problem of front-end data management. The tools used are:

1. redux-actions - for FSA compliance
2. redux-orm - for normalization and data consistency
3. normalizr - for transforming and untransforming server-side responses

## Concepts
Redux is big on functional programming, and, a such, a good data layer for use with redux should expose functions as pure as possible.

#### Remote APIs
Your app should have a `requests/*` directory that describes all the external endpoints your app will be hitting. `request`s should all be functions that return a promise with the external response:

```typesript
run :: (any) -> Promise
```

For example: `app/requests/user.js` might look like:

```javascript
import ajax from 'ember-ajax/request';

export function find(id) {
  return ajax(`my/endpoint/users/${id}`);
}
```

In general, keep your request functions as simple and stupid as possible. They shouldn't know about your application at all and so should theoretically be drag-and-droppable into any application.

#### Thunkers
First, what is a thunk? A thunk is a plain old javascript function which takes 1 argument (a function conventionally called `dispatch`) and uses that dispatch function inside it.

Q: But why do we need it?
A: Often when dealing with upstream remote sources, a server might return a response that contains many local many local models, for example, a GET to `/api/users` might return:

```javascript
const serverResponse = {
  "users": {
    "miku": { "id": "miku", "name": "miku hatsune" },
    "luka": { "id": "luka", "name": "luka megurine" },
    "gumi": { "id": "gumi", "name": "GUMI" }
  },
  "songs": {
    "ifudodo": { "name": "ifudodo", "bpm": 145, "singers": ["miku", "luka", "gumi"] }
  }
};
```
From the point of view of populating our ORM store with emitting redux actions, we'll want to emit 4 actions:

```javascript
const actionMiku = { type: "UPDATE_USER", payload: serverResponse.users.miku };
const actionLuka = { type: "UPDATE_USER", payload: serverResponse.users.luka };
const actionGumi = ...
```

but how do we do that? The simplest most obvious answer is to batch the actions, and that's exactly what `redux-thunk` does:

```javascript
const batchedActionThunk = (dispatch) => {
  dispatch(actionMiku);
  dispatch(actionLUka);
  dispatch(actionGumi);
  dispatch(actionSongs);
  ...
};

/* Later... */
redux.dispatch(batchedActionThunk);
```

So what is a thunker? A thunker is a function that takes an remote response and transforms them into a thunk that will populate the redux store

```typescript
type Thunk = (dispatch: Dispatch): Promise

type Thunker = (response: JSON): Thunk
```

In other words, thunkers make thunks.

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
As per exisiting Ember convention, `Ember.Route`'s model hook is where you should perform your remote calls and populate your redux store.

`app/routes/user`
```javascript
import { findUser } from 'dummy/requests/user';
import toThunk from 'dummy/thunkers/user';

function model(dispatch, params) {
  return findUser(params.id).then(toThunk).then(dispatch);
}
...
```

How you string together your remote-api request into redux is up to your application. Although this example uses `redux-thunk`, if you need to use `redux-saga`, bare actions, or whatever, simply switch out the middle `toThunk` to whatever it is that creates an `dispatch`able object.

## Accessing Data

Ember redux presents 2 similar ways of accessing redux state data:

### Via delegates
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

### Via route-connect
If you wish to skip writing a `data-delegate` component for each new route, it's also possible to use https://github.com/dustinfarris/ember-redux-route-connect

* Note: as of Feburary 15, 2017, there is a bug in ember-redux-route-connect where if you're using ember-redux 2.x.x, you'll run in to an `npm:redux` missing bug. You can fix this by using my fork here:

https://github.com/foxnewsnetwork/ember-redux-route-connect

```javascript
import { findUser } from 'dummy/requests/user';
import toThunk from 'dummy/thunkers/user';
import route from 'ember-redux/route';
import connect from 'ember-redux-route-connect';

function model(dispatch, params) {
  return findUser(params.id).then(toThunk).then(dispatch);
}
function statesToCompute(state, params) {
  return {
    model: selectUserById(state, params.id)
  };
}
const Route = route({ model })(Ember.Route.extend({}));
export default connect(statesToCompute)(Route);
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

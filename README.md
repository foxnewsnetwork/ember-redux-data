# ember-redux-data

Blueprints and utilities for using the redux data stack in Ember.js

## Redux Data Stack
Unlike Ember.js which recommends ember-data as your app's go-to data-consistency and remote-io layer (and react which recommends graphQL via relay), redux is lot less opinionated regarding what tools your app should use in this regard.

The purpose of this repo is to expose the tools and usage patterns that I personally found to cleanly and simply solve the problem of front-end data management. The tools used are:

1. redux-actions - for FSA compliance
2. redux-orm - for normalization and data consistency
3. normalizr - for transforming and untransforming server-side responses

## How To Use
Request objects serve as the contact point between ember's `model` hook and populating the redux store with data entries.

Consider an example route `dummy/routes/user.js`
```javascript
import Request from 'dummy/requests/users';
import route from 'ember-redux/route';
import Ember from 'ember';
import ENV from 'dummy/config/environment';

const { inject: { service } } = Ember;
const request = new Request(ENV);

function model(params) {
  const { dog, cat, bat } = this.getProperties('dog', 'cat', 'bat');
  const redux = this.get('redux');
  const findThunk = request.find({ dog, cat, bat, id: params.id });

  return redux.dispatch(findThunk).then(() => params.id);
}

export default route({ model })(Ember.Component.extend({
  dog: service('dog'),
  cat: ...,
  bat: ...
}));
```
And as with all redux apps, you pull data out of the redux store with designated `data-delegate` components like so:

```handlebars
{{#data-delegate-single-user userId=model as |user|}}
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

So notice we have 2 concepts:

1. Requests - used to make remote calls, transform server-data, and populate the redux store
2. Selectors - used to pull useful data from the redux store
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

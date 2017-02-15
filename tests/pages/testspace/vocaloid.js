import {
  create,
  visitable,
  text
} from 'ember-cli-page-object';

export default create({
  visit: visitable('/testspace/vocaloid/:id'),
  name: text('#testspace-vocaloid__name')
});

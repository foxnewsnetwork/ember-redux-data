import { createActions } from 'redux-actions';

export default createActions({
  ORM_CREATE_OR_UPDATE_MODEL: (ModelClass, data) => ({ ModelClass, data }),
  ORM_DESTROY_MODEL: (ModelClass, data) => ({ ModelClass, data })
})

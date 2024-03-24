import * as a from './actionTypes';

export const createEntity = (newEntity) => ({
  type: a.CREATE_ENTITY,
  payload: newEntity,
});

export const removeEntity = (id) => ({
  type: a.REMOVE_ENTITY,
  payload: id,
});

export const editEntity = (id, updates) => ({
  type: a.EDIT_ENTITY,
  payload: { id, updates },
});

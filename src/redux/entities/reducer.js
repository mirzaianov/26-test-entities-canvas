import * as a from './actionTypes';

const initialState = [];

const entitiesReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.CREATE_ENTITY:
      return [...state, action.payload];
    case a.REMOVE_ENTITY:
      return state.filter((book) => book.id !== action.payload);
    case a.EDIT_ENTITY:
      return state.map((entity) =>
        entity.id === action.payload.id
          ? { ...entity, ...action.payload.updates }
          : entity,
      );
    default:
      return state;
  }
};

export default entitiesReducer;

import * as a from './actionTypes';

export const setFormInputs = (name, coordinates, labels) => ({
  type: a.SET_FORM_INPUTS,
  payload: { name, coordinates, labels },
});

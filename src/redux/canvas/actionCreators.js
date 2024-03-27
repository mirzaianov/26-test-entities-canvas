import * as a from './actionTypes';

export const setDimensions = (width, height) => ({
  type: a.SET_DIMENSIONS,
  payload: { width, height },
});

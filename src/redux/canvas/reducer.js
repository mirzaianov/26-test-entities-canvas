import * as a from './actionTypes';

const initialState = {
  width: window.innerWidth - 100,
  height: window.innerHeight,
};

const canvasReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.SET_DIMENSIONS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default canvasReducer;

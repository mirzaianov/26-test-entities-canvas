import * as a from './actionTypes';

const initialState = {
  name: '',
  coordinates: '',
  labels: '',
};

const formInputsReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.SET_FORM_INPUTS:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default formInputsReducer;

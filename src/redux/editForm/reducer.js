import * as a from './actionTypes';

const initialState = {
  isEdit: false,
  editId: null,
  editName: '',
  editCoordinates: '',
  editLabels: '',
};

const editFormReducer = (state = initialState, action) => {
  switch (action.type) {
    case a.SET_EDIT_FORM:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

export default editFormReducer;

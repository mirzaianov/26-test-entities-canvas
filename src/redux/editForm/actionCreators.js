import * as a from './actionTypes';

export const setEditForm = (
  isEdit,
  editId,
  editName,
  editCoordinates,
  editLabels,
) => ({
  type: a.SET_EDIT_FORM,
  payload: { isEdit, editId, editName, editCoordinates, editLabels },
});

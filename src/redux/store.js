import { configureStore } from '@reduxjs/toolkit';
import entitiesReducer from './entities/reducer';
import formInputsReducer from './formInputs/reducer';
import editFormReducer from './editForm/reducer';
import canvasReducer from './canvas/reducer';

const store = configureStore({
  reducer: {
    entities: entitiesReducer,
    formInputs: formInputsReducer,
    editForm: editFormReducer,
    canvas: canvasReducer,
  },
});

export default store;

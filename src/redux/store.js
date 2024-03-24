import { configureStore } from '@reduxjs/toolkit';
import entitiesReducer from './entities/reducer';

const store = configureStore({
  reducer: {
    entities: entitiesReducer,
  },
});

export default store;

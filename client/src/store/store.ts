import { combineReducers, configureStore } from "@reduxjs/toolkit";

import userReducer from "./slice/user";
import authReducer from "./slice/auth";
import commonApiSlice from "./api/main/user.api";

const rootReducer = combineReducers({
  user: userReducer,
  auth: authReducer,
  [commonApiSlice.reducerPath]: commonApiSlice.reducer
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (middleware) =>
    middleware({ immutableCheck: true }).concat(commonApiSlice.middleware)
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

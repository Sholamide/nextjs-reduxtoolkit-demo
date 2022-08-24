import { configureStore, combineReducers } from "@reduxjs/toolkit";
import thunkMiddleware from "redux-thunk";
import { createWrapper } from "next-redux-wrapper";
import cartReducer from "./cart/cartSlice";
import modalReducer from "./modal/modalSlice";

const combineReducer = combineReducers({
  cart: cartReducer,
  modal: modalReducer,
});

export const makeStore = () =>
  configureStore({
    reducer: combineReducer,
    middleware: [thunkMiddleware],
  });
export const wrapper = createWrapper(makeStore);

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    modal: modalReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

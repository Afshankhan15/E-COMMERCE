import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./userReducer";
import { productAPI } from "../api/productAPI";
import { cartReducer } from "./cartReducer";
import { orderReducer } from "./orderReducer";
import {customerReducer} from './customerReducer'

// backend server link
export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    // [userAPI.reducerPath]: userAPI.reducer, // API reducer
    [productAPI.reducerPath]: productAPI.reducer, // API reducer
    [userReducer.name]: userReducer.reducer, // Assuming userReducer is a function
    [cartReducer.name]: cartReducer.reducer, // Assuming cartReducer is a function
    [orderReducer.name]: orderReducer.reducer, // Assuming cartReducer is a function
    [customerReducer.name]: customerReducer.reducer, // Assuming cartReducer is a function
  },
  // middleware: (getDefaultMiddleware) =>
  //   getDefaultMiddleware().concat(userAPI.middleware, productAPI.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

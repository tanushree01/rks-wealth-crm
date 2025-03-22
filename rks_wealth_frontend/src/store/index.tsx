import { configureStore } from "@reduxjs/toolkit";
import investmentReducer from "./slices/slice";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    investment: investmentReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

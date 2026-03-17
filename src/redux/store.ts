// src/store/index.ts
import localeReducer from "./slices/localeSlice";
import themeReducer from "./slices/themeSlice";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    locale: localeReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
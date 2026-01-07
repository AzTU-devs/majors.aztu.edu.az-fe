import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Locale = "az" | "en";

interface LocaleState {
  value: Locale;
}

const initialState: LocaleState = {
  value: "az",
};

const localeSlice = createSlice({
  name: "locale",
  initialState,
  reducers: {
    setLocale: (state, action: PayloadAction<Locale>) => {
      state.value = action.payload;
    },
  },
});

export const { setLocale } = localeSlice.actions;
export default localeSlice.reducer;
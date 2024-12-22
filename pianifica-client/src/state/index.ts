import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export interface initialStateType {
  isSidebarCollapsed: boolean;
  isDarkMode: boolean;
  accessToken: string | null;
}

const initialState: initialStateType = {
  isSidebarCollapsed: false,
  isDarkMode: false,
  accessToken: null,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setIsSidebarCollapsed: (state, action: PayloadAction<boolean>) => {
      state.isSidebarCollapsed = action.payload;
    },
    setIsDarkMode: (state, action: PayloadAction<boolean>) => {
      state.isDarkMode = action.payload;
    },
    setAccessToken: (state, action: PayloadAction<string | null>) => {
      state.accessToken = action.payload;
    },
  },
});

export const { setIsSidebarCollapsed, setIsDarkMode, setAccessToken } =
  globalSlice.actions;
export default globalSlice.reducer;

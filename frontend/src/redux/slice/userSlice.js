import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
    },
    setIsAuthenticated(state, action) {
      state.isAuthenticated = action.payload;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, setIsAuthenticated, logout } = userSlice.actions;

export default userSlice.reducer;

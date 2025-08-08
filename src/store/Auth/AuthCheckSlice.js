import { createSlice } from "@reduxjs/toolkit";

export const AuthCheckSlice = createSlice({
  name: "AuthCheck",
  initialState: {
    status: false
  },
  reducers: {
    addauth: (state, action) => {
      return action.payload;
    },
  },
});

export const AuthCheckAction = AuthCheckSlice.actions;
export default AuthCheckSlice;

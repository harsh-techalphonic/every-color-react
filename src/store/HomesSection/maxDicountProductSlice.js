import { createSlice } from "@reduxjs/toolkit";

export const maxDicountProductSlice = createSlice({
  name: "maxDicountProduct",
  initialState: {
    status: false,
    data: [],
  },
  reducers: {
    addMaxDicountProduct: (store, action) => {
      return {
        status: true,
        data: action.payload,
      };
    },
  },
});

export const maxDicountProductAction = maxDicountProductSlice.actions;
export default maxDicountProductSlice;

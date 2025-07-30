import { createSlice } from "@reduxjs/toolkit";

export const singleProductSlice = createSlice({
  name: "singleProduct",
  initialState: [],
  reducers: {
    addProduct: (store, action) => {
      return [action.payload,...store];
    }
  },
});
export const singleProductAction = singleProductSlice.actions;
export default singleProductSlice;

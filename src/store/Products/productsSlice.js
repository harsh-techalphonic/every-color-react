import { createSlice } from "@reduxjs/toolkit";

export const productsSlice = createSlice({
  name: "products",
  initialState: {
    status: false,
    data: [],
  },
  reducers: {
    getProduct: (store, action) => {
      return {
        status: true,
        data: [...action.payload.data],
      };
    }
  },
});
export const productsAction = productsSlice.actions;
export default productsSlice;

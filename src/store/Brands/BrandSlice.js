import { createSlice } from "@reduxjs/toolkit";

export const brandsSlice = createSlice({
  name: "brands",
  initialState: {
    status: false,
    brandImageUrl: "",
    data: [],
  },
  reducers: {
    getBrands: (state, action) => {
      state.status = true;
      state.brandImageUrl = action.payload.brandImageUrl;
      state.data = action.payload.data;
    },
  },
});
export const brandsAction = brandsSlice.actions;
export default brandsSlice;
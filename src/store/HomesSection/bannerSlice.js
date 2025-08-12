// bannerSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  status: false,
  data: [],
};

export const bannersSlice = createSlice({
  name: "banners",
  initialState,
  reducers: {
    getCategory: (state, action) => {
      state.status = true;
      state.data = action.payload;  // Adjust if your API returns nested data like action.payload.data
    },
  },
});

export const bannersAction = bannersSlice.actions;
export default bannersSlice;

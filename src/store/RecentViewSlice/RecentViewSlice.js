// store/Products/recentViewSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  recentViews: [],
  products: [],
  count: 0,
};

const recentViewSlice = createSlice({
  name: "recentView",
  initialState,
  reducers: {
    setRecentViews(state, action) {
      state.recentViews = action.payload; 
      state.products = action.payload.map(item => item.product); 
      state.count = action.payload.length;
    },
    clearRecentViews(state) {
      state.recentViews = [];
      state.products = [];
      state.count = 0;
    }
  },
});

export const { setRecentViews, clearRecentViews } = recentViewSlice.actions;
export default recentViewSlice;

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  sorted: "newest",          // sort key
  priceRangeMin: 0,
  priceRangeMax: 0,
  ratingSorted: 0,           // your name for rating threshold
  countProduct: 0,
};

const filtersSlice = createSlice({
  name: "filters",
  initialState,
  reducers: {
    sorted: (state, action) => {
      state.sorted = action.payload;
    },
    ratingSorted: (state, action) => {
      state.ratingSorted = action.payload;
    },
    priceRangeMin: (state, action) => {
      state.priceRangeMin = action.payload;
    },
    priceRangeMax: (state, action) => {
      state.priceRangeMax = action.payload;
    },
    countProduct: (state, action) => {
      state.countProduct = action.payload;
    },
    clearRating: (state) => {
      state.ratingSorted = 0;
    },
    resetAll: (state) => {
      state.sorted = "newest";
      state.priceRangeMin = 0;
      state.priceRangeMax = 0;
      state.ratingSorted = 0;
      state.countProduct = 0;
    },
  },
});

export const filtersAction = filtersSlice.actions;
export default filtersSlice.reducer; // <-- important: export reducer, not slice object

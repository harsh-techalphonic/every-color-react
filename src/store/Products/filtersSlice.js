import { createSlice } from "@reduxjs/toolkit";

export const filtersSlice = createSlice({
  name: "filters",
  initialState: {
    sorted: "newest",
    priceRangeMin: 0,
    priceRangeMax: 0,
    ratingSorted: 0,
    countProduct: 0,
  },
  reducers: {
    sorted: (store, action) => {
      return { ...store, sorted: action.payload };
    },
    ratingSorted: (store, action) => {
      return { ...store, ratingSorted: action.payload };
    },
    priceRangeMin: (store, action) => {
      return { ...store, priceRangeMin: action.payload };
    },
    priceRangeMax: (store, action) => {
      return { ...store, priceRangeMax: action.payload };
    },
    countProduct: (store, action) => {
      return { ...store, countProduct: action.payload };
    },
  },
});
//dsdsdskdk
export const filtersAction = filtersSlice.actions;
export default filtersSlice;

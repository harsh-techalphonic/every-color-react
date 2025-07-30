import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

export const allCategoriesSlice = createSlice({
  name: "allCategories",
  initialState: {
    status: false,
    data: [],
  },
  reducers: {
    getCategory: (store, action) => {
      // console.log(action.payload)
      return {
        status: true,
        data: [...action.payload],
      };
    },
  },
});
export const allCategoriesAction = allCategoriesSlice.actions;
export default allCategoriesSlice;

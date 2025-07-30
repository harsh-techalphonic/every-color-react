import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

export const categoriesSlice = createSlice({
  name: "categories",
  initialState: {
    status: false,
    data: [],
  },
  reducers: {
    getCategory: (store, action) => {
      return {
        status: true,
        data: [...action.payload.categories],
      };
    },
  },
});
export const categoriesAction = categoriesSlice.actions;
export default categoriesSlice;

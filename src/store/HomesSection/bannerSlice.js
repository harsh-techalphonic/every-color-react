import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { useSelector } from "react-redux";

export const bannersSlice = createSlice({
  name: "banners",
  initialState: {
    status: false,
    data: [],
  },
  reducers: {
    getCategory: (store, action) => {
      return {
        status: true,
        data: [...action.payload.data],
      };
    },
  },
});
export const bannersAction = bannersSlice.actions;
export default bannersSlice;

import { createSlice } from "@reduxjs/toolkit";

export const basicInfoSlice = createSlice({
  name: "basicInfo",
  initialState: {
    status: false,
    data: {},
  },
  reducers: {
    getInfo: (store, action) => {
      return {
        status: true,
        data: {...action.payload},
      };
    },
  },
});

export const basicInfoAction = basicInfoSlice.actions;
export default basicInfoSlice;

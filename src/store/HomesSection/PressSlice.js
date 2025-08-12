import { createSlice } from "@reduxjs/toolkit";

export const pressSlice = createSlice({
  name: "press",
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

export const pressAction = pressSlice.actions;
export default pressSlice;

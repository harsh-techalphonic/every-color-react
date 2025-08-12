import { createSlice } from "@reduxjs/toolkit";

export const testimonialSlice = createSlice({
  name: "testimonials",
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

export const testimonialAction = testimonialSlice.actions;
export default testimonialSlice;

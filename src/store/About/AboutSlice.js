

import { createSlice } from "@reduxjs/toolkit";

export const AboutSlice = createSlice({
  name: "About",
  initialState: {
    status: false,
    data:{},
  },
  reducers: {
    getInfo: (state, action) => {
      return {
        status: true,
        data:{...action.payload},
      };
    },
  },
});

export const AboutAction = AboutSlice.actions;
export default AboutSlice; 

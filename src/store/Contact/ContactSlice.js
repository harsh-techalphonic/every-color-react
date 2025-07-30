

import { createSlice } from "@reduxjs/toolkit";

export const ContactSlice = createSlice({
  name: "Contact",
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

export const ContactAction = ContactSlice.actions;
export default ContactSlice; 

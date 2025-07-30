

import { createSlice } from "@reduxjs/toolkit";

export const TcpprcSlice = createSlice({
  name: "Tcpprc",
  initialState: {
    status: false,
    data:{
        privacy_policy:"",
        terms_condition:"",
        return_cancled:"",
        about:""
    },
  },
  reducers: {
    getInfo: (state, action) => {
      return {
        status: true,
        data:{
            privacy_policy:action.payload[1],
            terms_condition:action.payload[0],
            return_cancled:action.payload[2],
            about:action.payload[3],
            terms_condition_vendor:action.payload[4],
            privacy_policy_vendor:action.payload[5]
        },
      };
    },
  },
});

export const TcpprcAction = TcpprcSlice.actions;
export default TcpprcSlice; 

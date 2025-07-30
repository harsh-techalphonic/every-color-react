import { createSlice } from "@reduxjs/toolkit";

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: localStorage.getItem("wishlist") ? JSON.parse(localStorage.getItem("wishlist")).length : 0,
  reducers: {
    addWishlist: (store, action) => {
      return action.payload;
    },
  },
});
//dsdsdskdk
export const wishlistAction = wishlistSlice.actions;
export default wishlistSlice;

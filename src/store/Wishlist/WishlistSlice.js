// store/Products/wishlistSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  ids: [],
  products: [],
  count: 0,
};

const WishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist(state, action) {
      state.ids = action.payload.ids;
      state.products = action.payload.products;
      state.count = action.payload.ids.length;
    },
    clearWishlist(state) {
      state.ids = [];
      state.products = [];
      state.count = 0;
    }
  }
});

export const WishlistAction = WishlistSlice.actions;
export default WishlistSlice; 

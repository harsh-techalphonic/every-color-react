import { createSlice } from "@reduxjs/toolkit";

export const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
  },
  reducers: {
    setWishlist: (state, action) => {
      const seen = new Set();
      state.items = action.payload.filter((p) => {
        if (!p || seen.has(p.product_id)) return false;
        seen.add(p.product_id);
        return true;
      });
    },
    addToWishlist: (state, action) => {
      const exists = state.items.some(
        (p) => p.product_id === action.payload.product_id
      );
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter((p) => p.product_id !== action.payload);
    },
  },
});

export const wishlistAction = wishlistSlice.actions;
export default wishlistSlice.reducer;

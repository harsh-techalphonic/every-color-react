
import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

export const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // addCart: (store, action) => {
    //   const newItem = action.payload;

    //   // Check if item already exists in the cart based on prd_id
    //   const exists = store.some((item) => item?.id === newItem?.id);

    //   if (!exists) {
    //     const updatedCart = [newItem, ...store];
    //     localStorage.setItem("cart", JSON.stringify(updatedCart));
    //     return updatedCart;
    //   }

    //   // If it already exists, do not add again
    //   return store;
    // },

    removeCart: (store, action) => {
      const updatedCart = store.filter(
        (item) => item?.id !== action.payload?.id
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    },

    addCart: (store, action) => {
      const newItem = action.payload;
      const exists = store.some((item) => item?.id === newItem?.id);
      if (!exists) {
        const updatedCart = [newItem, ...store];
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        return updatedCart;
      }
      return store;
    },

    updateCart: (store, action) => {
      const updatedCart = store.map((item) =>
        item.prd_id === action.payload.prd_id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    },

    clearCart: () => {
      localStorage.removeItem("cart");
      return [];
    },
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice;

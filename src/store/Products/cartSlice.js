import { createSlice } from "@reduxjs/toolkit";

export const cartSlice = createSlice({
  name: "cart",
  initialState: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart"))
    : [],
  reducers: {
    addCart: (store, action) => {
      localStorage.setItem("cart", JSON.stringify([action.payload,...store]));
      return [action.payload,...store];
    },
    removeCart: (store, action) => {
      localStorage.setItem("cart", JSON.stringify([action.payload]));
      return action.payload;
    },
    updateCart: (store, action) => {
      // console.log()
      const updatedCart = JSON.parse(localStorage.getItem('cart')).map((item) =>
        item.prd_id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
      );
      localStorage.setItem("cart", JSON.stringify(updatedCart));
      return updatedCart;
    },
  },
});

export const cartAction = cartSlice.actions;
export default cartSlice;

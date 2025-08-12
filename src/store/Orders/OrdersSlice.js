import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  products: [],
  count: 0,
};

const OrdersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    setOrders(state, action) {
      state.orders = action.payload;
      state.products = action.payload.flatMap(order => order.products);
      state.count = action.payload.length;
    },
    clearOrders(state) {
      state.orders = [];
      state.products = [];
      state.count = 0;
    }
  },
});

export const { setOrders, clearOrders } = OrdersSlice.actions;
export default OrdersSlice;

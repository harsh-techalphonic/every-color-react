import axios from "axios";
import config from "../Config/config.json";
import { setOrders } from "../store/Orders/OrdersSlice";

export default function OrderApi(dispatch, token) {
  console?.log('localStorage.getItem("OrderApi") ------>>>>>', token);

  if (!token) {
    console.warn("No token found for order API");
    return;
  }

  axios
    .get(`${config.API_URL}/user/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("Orders API Response: ----------?>>>>>>>>", res);
      if (Array.isArray(res.data)) {
        dispatch(setOrders(res.data));
      } else {
        console.warn("Unexpected orders API response:", res.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching orders:", err);
    });
}

import { API_URL, PlaceOrder } from "../../Config/config";

export const PlaceOrderApis = async (payload) => {
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`${API_URL}${PlaceOrder}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload), // ✅ send actual payload
    });

    const result = await response.json();
    // console.log("Place Order Response:", result);
    return result;
  } catch (error) {
    console.log("Error placing order:", error);
    return null;
  }
};

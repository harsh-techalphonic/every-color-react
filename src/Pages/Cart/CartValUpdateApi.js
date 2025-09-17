// CartValUpdateApi.js
import { API_URL, UpdateCartQut } from "../../Config/config";

export const updateCartItemQuantity = async (prd_id, quantity) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${UpdateCartQut}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        product_id: prd_id,
        quantity: quantity,
      }),
    });

    const result = await response.json();
    console.log("Update Cart Response:", result);

    return result.status ? result : null;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    return null;
  }
};

import { API_URL, PrivacyPolicyApi, RemoveCart } from "../Config/config";
import config from "../Config/config.json";
import axios from "axios";

export const fetchCartAPI = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${config.API_URL}${config.GetCartList}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { status: false, data: [], error };
  }
};

export const deleteCartItem = async (id, setData) => {
  const token = localStorage.getItem("token");
  console.log("`${API_URL}${RemoveCart}`", `${API_URL}${RemoveCart}`);
  console?.log("handleDelete ---->>", id);

  try {
    const response = await axios.post(
      `${API_URL}${RemoveCart}`,
      {
        id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // 'Content-Type': 'application/json',
        },
      }
    );

    console.log("response", response?.data);

    if (response?.data?.status === true) {
      setData(response?.data?.status);
    }
  } catch (error) {
    console.error("Network Error:", error.message);
    alert("Error: Something went wrong");
  }
};

export const getPrivacyPolicy = async (setData,apiPath) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(`${API_URL}${apiPath}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console?.log("response?.data", response?.data);
    if (response?.data) {
      setData(response?.data);
    } else if (response?.data?.errors) {
      alert("Error: " + (response?.data?.errors?.message || "Login failed."));
    } else {
      alert("Error: Unexpected response from server.");
    }
  } catch (error) {
    alert("Error: Something went wrong");
    console.error("Network Error:", error);
  }
};

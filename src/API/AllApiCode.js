import {
  API_URL,
  GetRefundReturnApi,
  ProfileUser,
  WishlistApi,
} from "../Config/config";
import axios from "axios";

export const fetchwishlistdata = async (apiPath, setData) => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${apiPath}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    setData(result?.data);
    return result;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { status: false, data: [], error };
  }
};
export const fetchWishListApi = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${WishlistApi}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { status: false, data: [], error };
  }
};
export const fetchUserDataApi = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${ProfileUser}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { status: false, data: [], error };
  }
};
export const deleteCartItem = async (id, apiPath) => {
  const token = localStorage.getItem("token");
  console.log("`${API_URL}${RemoveCart}`", `${API_URL}${apiPath}`);
  console.log("handleDelete ---->>", id);

  try {
    const response = await axios.post(
      `${API_URL}${apiPath}`,
      { id },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("handleDelete 1111", response?.data);
    return response?.data?.status === true; // Return true/false
  } catch (error) {
    console.error("Network Error:", error.message);
    alert("Error: Something went wrong");
    return false;
  }
};
export const getPrivacyPolicy = async (setData, apiPath) => {
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
export const getReturnCancelation = async (setData) => {
  const token = localStorage.getItem("token");
  try {
    const response = await axios.get(
      `${API_URL}/web/return-and-cancellation-policy`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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
export const getRefundAndReturnList = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await fetch(`${API_URL}${GetRefundReturnApi}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        // Authorization:`Bearer eyJpdiI6IkRuNUIrdm1ZZ0R6Q0hUSll0RWFNK2c9PSIsInZhbHVlIjoiU1ZhK1Z3WmxBNWNGN1g5Yk8zRGVkUT09IiwibWFjIjoiMzNkZGVlNDY0YTFkYjY5MjIzNzE3MjM5ODk5M2EwY2RkN2E3Nzc2ZjJmZjUyNjBjMmU3MDlkYmE1MjVjNjlhZCIsInRhZyI6IiJ9`,
      },
    });

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { status: false, data: [], error };
  }
};


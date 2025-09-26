// import { API_URL, sendRefundAndReplace } from "../../../Config/config";

// // In your API file (ApiExportOrBulk.js)
// export const sendRefundAndReplaceApi = async (formData) => {
//   console.log("Refund API URL:", `${API_URL}${sendRefundAndReplace}`);

//   try {
//     const token = localStorage.getItem("token");

//     const response = await fetch(`${API_URL}${sendRefundAndReplace}`, {
//       method: "POST",
//       headers: {
//         Authorization: `Bearer ${token}`,
//         // Don't set Content-Type for FormData - browser will set it automatically with boundary
//       },
//       body: formData,
//     });

//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }

//     const data = await response.json();
//     return data;
//   } catch (error) {
//     console.error("Error in sendRefundAndReplaceApi:", error);
//     throw error; // Re-throw to handle in the component
//   }
// };


import axios from "axios";
import { API_URL, sendRefundAndReplace } from "../../../Config/config";

// In your API file (ApiExportOrBulk.js)
export const sendRefundAndReplaceApi = async (formData) => {
  // console.log("Refund API URL:", `${API_URL}${sendRefundAndReplace}`);

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}${sendRefundAndReplace}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          // No need to set Content-Type for FormData, axios will handle it automatically
        },
      }
    );

    return response.data; // axios stores parsed JSON in response.data
  } catch (error) {
    console.error("Error in sendRefundAndReplaceApi:", error);
    // You can extract the server error message if available
    throw error.response?.data || error.message;
  }
};

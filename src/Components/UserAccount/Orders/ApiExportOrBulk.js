


import axios from "axios";
import { API_URL, sendRefundAndReplace } from "../../../Config/config";


export const sendRefundAndReplaceApi = async (formData) => {
  

  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${API_URL}${sendRefundAndReplace}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
         
        },
      }
    );

    return response.data; 
  } catch (error) {
    console.error("Error in sendRefundAndReplaceApi:", error);
    
    throw error.response?.data || error.message;
  }
};

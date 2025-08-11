// API/RecentViewApi.js
import axios from "axios";
import config from '../Config/config.json';

import { setRecentViews } from "../store/RecentViewSlice/RecentViewSlice";

export default function RecentViewApi(dispatch) {
  const token = localStorage.getItem("token");
  if (!token) {
    console.warn("No token found for recent view API");
    return;
  }

  axios
    .get(`${config.API_URL}/get-recent-view`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      console.log("recentview", res.data.data); // Log data here

      if (res.data.status && Array.isArray(res.data.data)) {
        dispatch(setRecentViews(res.data.data));
      } else {
        console.warn("Unexpected recent view API response:", res.data);
      }
    })
    .catch((err) => {
      console.error("Error fetching recent views:", err);
    });
}

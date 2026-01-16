// // API/RecentViewApi.js
// import axios from "axios";
// import config from '../Config/config.json';

// import { setRecentViews } from "../store/RecentViewSlice/RecentViewSlice";

// export default function RecentViewApi(dispatch) {
//   const token = localStorage.getItem("token");
//   if (!token) {
//     console.warn("No token found for recent view API");
//     return;
//   }

//   axios
//     .get(`${config.API_URL}/get-recent-view`, {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     })
//     .then((res) => {

//       if (res.data.status && Array.isArray(res.data.data)) {
//         dispatch(setRecentViews(res.data.data));
//       } else {
//         console.warn("Unexpected recent view API response:", res.data);
//       }
//     })
//     .catch((err) => {
//       console.error("Error fetching recent views:", err);
//     });
// }


// API/RecentViewApi.js - Simplified version
import axios from "axios";
import config from '../Config/config.json';
import { setRecentViews } from "../store/RecentViewSlice/RecentViewSlice";

export default function RecentViewApi(dispatch) {
  const token = localStorage.getItem("token");
  const cacheKey = 'recentViewsCache';
  
  // If no token, skip the API call
  if (!token) {
    console.log("No token, skipping recent views API call");
    return;
  }
  
  // Debounce: Skip if recent request was made
  const lastRequestTime = localStorage.getItem('recentViewLastRequest');
  if (lastRequestTime && Date.now() - parseInt(lastRequestTime) < 30000) { // 30 seconds
    console.log("Recent view request made recently, skipping...");
    // Still use cached data if available
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          dispatch(setRecentViews(parsedData));
        }
      } catch (error) {
        console.warn("Failed to parse cached recent views");
      }
    }
    return;
  }
  
  // Update last request time
  localStorage.setItem('recentViewLastRequest', Date.now().toString());
  
  axios.get(`${config.API_URL}/get-recent-view`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    timeout: 8000
  })
  .then((res) => {
    if (res.data.status && Array.isArray(res.data.data)) {
      // Cache the response
      localStorage.setItem(cacheKey, JSON.stringify(res.data.data));
      dispatch(setRecentViews(res.data.data));
    }
  })
  .catch((err) => {
    console.log("Error fetching recent views, using cache if available");
    
    // Use cached data on error
    const cachedData = localStorage.getItem(cacheKey);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        if (Array.isArray(parsedData)) {
          dispatch(setRecentViews(parsedData));
        }
      } catch (error) {
        console.warn("Failed to parse cached recent views");
      }
    }
  });
}

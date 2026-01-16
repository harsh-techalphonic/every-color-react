// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import config from "../Config/config.json";
// import { pressAction } from "../store/HomesSection/PressSlice";

// export default function PressApi() {
//   const press = useSelector((store) => store.press);
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     if (press.status) return;
//     axios
//       .get(`${config.API_URL}/web/section/in-press-slide`)
//       .then(function (response) {
//         dispatch(pressAction.getInfo(response.data));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }, [press.status]);
//   return true;
// }


import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { pressAction } from "../store/HomesSection/PressSlice";

export default function PressApi() {
  const press = useSelector((store) => store.press);
  const dispatch = useDispatch();
  
  // Track request state
  const requestInProgress = useRef(false);
  // Cache key for press data
  const cacheKey = 'pressDataCache';

  useEffect(() => {
    // Skip if already loaded or request in progress
    if (press.status || requestInProgress.current) {
      return;
    }

    const fetchPressData = async () => {
      requestInProgress.current = true;
      
      try {
        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        // Cache valid for 15 minutes (900000 ms) - press data might update occasionally
        const isCacheValid = cachedData && cacheTime && 
                            (Date.now() - parseInt(cacheTime) < 900000);
        
        if (isCacheValid) {
          try {
            const parsedData = JSON.parse(cachedData);
            console.log("📂 Using cached press data");
            dispatch(pressAction.getInfo(parsedData));
            return; // Exit early, use cache
          } catch (error) {
            console.warn("Failed to parse cached press data, fetching fresh...");
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(`${cacheKey}_time`);
          }
        }

        // Fetch fresh data with retry logic
        const response = await fetchWithRetry(`${config.API_URL}/web/section/in-press-slide`, 2);
        
        if (response.data) {
          // Cache successful response
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          
          dispatch(pressAction.getInfo(response.data));
          console.log("✅ Press data loaded successfully");
        }
      } catch (error) {
        handlePressError(error, cacheKey, dispatch);
      } finally {
        requestInProgress.current = false;
      }
    };

    // Add delay to prevent rapid firing on page load
    const timeoutId = setTimeout(() => {
      fetchPressData();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [press.status, dispatch]);

  return null;
}

// Retry logic with exponential backoff
async function fetchWithRetry(url, maxRetries = 2) {
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await axios.get(url, {
        timeout: 15000,
        headers: {
          'Cache-Control': 'no-cache',
          'Accept': 'application/json'
        },
        validateStatus: function(status) {
          return status < 500; // Accept all status codes less than 500
        }
      });

      console.log(`📡 Press API attempt ${i + 1}/${maxRetries + 1}: Status ${response.status}`);

      if (response.status === 429 && i < maxRetries) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s...
        console.log(`⏳ Rate limited for press data, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      console.log(`Press fetch attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries) throw error;
      
      // Network error - retry
      if (!error.response) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`🌐 Network error for press data, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

function handlePressError(error, cacheKey, dispatch) {
  console.error("❌ Error fetching press data:", error);
  
  // Try to use cached data (even expired)
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      console.log("📂 Using cached press data (possibly expired)");
      dispatch(pressAction.getInfo(parsedData));
    } catch (parseError) {
      console.warn("Failed to parse cached press data");
      dispatchEmptyPressData(dispatch);
    }
  } else {
    dispatchEmptyPressData(dispatch);
  }
}

function dispatchEmptyPressData(dispatch) {
  // Dispatch empty press data with status
  dispatch(pressAction.getInfo({
    status: true,
    data: [],
    slides: [],
    message: "Press coverage data not available"
  }));
}
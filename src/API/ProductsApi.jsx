// import axios from "axios";
// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import config from "../Config/config.json";
// import { productsAction } from "../store/Products/productsSlice";

// export default function ProductsApi() {
//   const products = useSelector((store) => store.products);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (products.status) return;


//     axios
//       .get(`${config.API_URL}/productsdata`)
//       .then(function (response) {
//         dispatch(productsAction.getProduct(response.data));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }, [products.status]);

//   return true;
// }



import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { productsAction } from "../store/Products/productsSlice";

export default function ProductsApi() {
  const products = useSelector((store) => store.products);
  const dispatch = useDispatch();
  
  // Track request state to prevent duplicate calls
  const requestInProgress = useRef(false);
  // Cache key for localStorage
  const cacheKey = 'productsDataCache';

  useEffect(() => {
    // If data already loaded or request in progress, skip
    if (products.status || requestInProgress.current) {
      return;
    }

    // Check cache first
    const fetchWithCache = async () => {
      const cachedData = localStorage.getItem(cacheKey);
      const cacheTime = localStorage.getItem(`${cacheKey}_time`);
      
      // Cache valid for 10 minutes (600000 ms)
      const isCacheValid = cachedData && cacheTime && 
                          (Date.now() - parseInt(cacheTime) < 600000);
      
      // Use cache if valid
      if (isCacheValid) {
        try {
          const parsedData = JSON.parse(cachedData);
          dispatch(productsAction.getProduct(parsedData));
          return; // Exit early, no need to fetch
        } catch (error) {
          console.warn("Failed to parse cached products data, fetching fresh...");
          localStorage.removeItem(cacheKey);
          localStorage.removeItem(`${cacheKey}_time`);
        }
      }

      // Fetch fresh data
      await fetchProducts();
    };

    const fetchProducts = async () => {
      requestInProgress.current = true;
      
      try {
        const response = await axios.get(`${config.API_URL}/productsdata`, {
          timeout: 15000, // 15 second timeout
          headers: {
            'Cache-Control': 'no-cache',
            'Accept': 'application/json'
          },
          // Accept some error statuses to handle gracefully
          validateStatus: function (status) {
            return status < 500; // Accept all status codes less than 500
          }
        });

        console.log("📦 Products API Response Status:", response.status);

        if (response.status === 429) {
          console.warn("Rate limited for products API, will retry later...");
          // Wait 5 seconds and retry once
          setTimeout(async () => {
            try {
              const retryResponse = await axios.get(`${config.API_URL}/productsdata`, {
                timeout: 15000
              });
              handleSuccessResponse(retryResponse);
            } catch (retryError) {
              handleError(retryError, cachedData);
            }
          }, 5000);
          return;
        }

        if (response.status === 200 && response.data) {
          handleSuccessResponse(response);
        } else {
          console.warn("Products API returned non-200 status:", response.status);
          handleError({ response }, cachedData);
        }
      } catch (error) {
        handleError(error, cachedData);
      } finally {
        requestInProgress.current = false;
      }
    };

    const handleSuccessResponse = (response) => {
      // Cache the successful response
      localStorage.setItem(cacheKey, JSON.stringify(response.data));
      localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
      
      dispatch(productsAction.getProduct(response.data));
      
      console.log("✅ Products data loaded successfully");
    };

    const handleError = (error, cachedData) => {
      console.error("❌ Error fetching products data:", error);
      
      // Try to use cached data even if expired
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          console.log("📂 Using cached products data (possibly expired)");
          dispatch(productsAction.getProduct(parsedData));
        } catch (parseError) {
          console.warn("Failed to use expired cache, using empty data");
          dispatch(productsAction.getProduct({
            products: [],
            status: true,
            message: "Failed to load products"
          }));
        }
      } else {
        // No cache available, dispatch empty data with status
        console.warn("No cached products data available");
        dispatch(productsAction.getProduct({
          products: [],
          status: true,
          message: "No products data available"
        }));
      }
    };

    // Add a small delay to prevent immediate firing on page load
    const timeoutId = setTimeout(() => {
      fetchWithCache();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [products.status, dispatch]);

  return null; // This component doesn't render anything
}
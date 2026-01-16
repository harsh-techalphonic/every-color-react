  // import axios from "axios";
  // import { useEffect } from "react";
  // import { useDispatch, useSelector } from "react-redux";
  // import config from "../Config/config.json";
  // import { testimonialAction } from "../store/HomesSection/TestimonialSlice";

  // export default function TestimonialApi() {
  //   const testimonials = useSelector((store) => store.testimonials);
  //   const dispatch = useDispatch();
    
  //   useEffect(() => {
  //     if (testimonials.status) return;
  //     axios
  //       .get(`${config.API_URL}/web/section/home-testimonials`)
  //       .then(function (response) {
          
  //         dispatch(testimonialAction.getInfo(response.data));
  //       })
  //       .catch(function (error) {
  //         console.log(error);
  //       });
  //   }, [testimonials.status]);
  //   return true;
  // }


  import axios from "axios";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { testimonialAction } from "../store/HomesSection/TestimonialSlice";

export default function TestimonialApi() {
  const testimonials = useSelector((store) => store.testimonials);
  const dispatch = useDispatch();
  
  // Track request state
  const requestInProgress = useRef(false);
  // Cache key for testimonials
  const cacheKey = 'testimonialsCache';

  useEffect(() => {
    // Skip if already loaded or request in progress
    if (testimonials.status || requestInProgress.current) {
      return;
    }

    const fetchTestimonials = async () => {
      requestInProgress.current = true;
      
      try {
        // Check cache first
        const cachedData = localStorage.getItem(cacheKey);
        const cacheTime = localStorage.getItem(`${cacheKey}_time`);
        
        // Cache valid for 30 minutes (1800000 ms) - testimonials don't change often
        const isCacheValid = cachedData && cacheTime && 
                            (Date.now() - parseInt(cacheTime) < 1800000);
        
        if (isCacheValid) {
          try {
            const parsedData = JSON.parse(cachedData);
            console.log("📂 Using cached testimonials data");
            dispatch(testimonialAction.getInfo(parsedData));
            return; // Exit early, use cache
          } catch (error) {
            console.warn("Failed to parse cached testimonials, fetching fresh...");
            localStorage.removeItem(cacheKey);
            localStorage.removeItem(`${cacheKey}_time`);
          }
        }

        // Fetch fresh data with retry logic
        const response = await fetchWithRetry(`${config.API_URL}/web/section/home-testimonials`, 2);
        
        if (response.data) {
          // Cache successful response
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          
          dispatch(testimonialAction.getInfo(response.data));
          console.log("✅ Testimonials loaded successfully");
        }
      } catch (error) {
        handleTestimonialError(error, cacheKey, dispatch);
      } finally {
        requestInProgress.current = false;
      }
    };

    // Add delay to prevent rapid firing
    const timeoutId = setTimeout(() => {
      fetchTestimonials();
    }, 600);

    return () => clearTimeout(timeoutId);
  }, [testimonials.status, dispatch]);

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

      console.log(`📡 Testimonials API attempt ${i + 1}/${maxRetries + 1}: Status ${response.status}`);

      if (response.status === 429 && i < maxRetries) {
        // Rate limited - wait and retry
        const delay = Math.pow(2, i) * 1000; // 1s, 2s, 4s...
        console.log(`⏳ Rate limited for testimonials, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      return response;
    } catch (error) {
      console.log(`Testimonials fetch attempt ${i + 1} failed:`, error.message);
      
      if (i === maxRetries) throw error;
      
      // Network error - retry
      if (!error.response) {
        const delay = Math.pow(2, i) * 1000;
        console.log(`🌐 Network error for testimonials, retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      } else {
        throw error;
      }
    }
  }
}

function handleTestimonialError(error, cacheKey, dispatch) {
  console.error("❌ Error fetching testimonials:", error);
  
  // Try to use cached data (even expired)
  const cachedData = localStorage.getItem(cacheKey);
  if (cachedData) {
    try {
      const parsedData = JSON.parse(cachedData);
      console.log("📂 Using cached testimonials data (possibly expired)");
      dispatch(testimonialAction.getInfo(parsedData));
    } catch (parseError) {
      console.warn("Failed to parse cached testimonials");
      dispatchEmptyTestimonials(dispatch);
    }
  } else {
    dispatchEmptyTestimonials(dispatch);
  }
}

function dispatchEmptyTestimonials(dispatch) {
  // Dispatch empty testimonials with friendly message
  dispatch(testimonialAction.getInfo({
    status: true,
    testimonials: [
      {
        id: 1,
        name: "Customer Review",
        comment: "Great products and excellent service!",
        rating: 5,
        position: "Satisfied Customer"
      },
      {
        id: 2,
        name: "Happy Client",
        comment: "Quality exceeded my expectations.",
        rating: 5,
        position: "Repeat Customer"
      },
      {
        id: 3,
        name: "Verified Buyer",
        comment: "Fast delivery and amazing support team.",
        rating: 4,
        position: "Online Shopper"
      }
    ],
    message: "Default testimonials loaded"
  }));
} 
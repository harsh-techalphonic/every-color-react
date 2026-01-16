// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import config from "../Config/config.json";
// import { categoriesAction } from "../store/Categories/categoriesSlice";
// export default function CategoriesApi() {
//   const categories = useSelector((store) => store.categories);
//   const dispatch = useDispatch();
  
//   useEffect(() => {
//     if (categories.status) return;
//     axios
//       .get(`${config.API_URL}/category`)
//       .then(function (response) {
//         dispatch(categoriesAction.getCategory(response.data));
//       })
//       .catch(function (error) {
//         console.log(error);
//       });
//   }, [categories.status]);
//   return true;
// }


import axios from "axios";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { categoriesAction } from "../store/Categories/categoriesSlice";

export default function CategoriesApi() {
  const categories = useSelector((store) => store.categories);
  const dispatch = useDispatch();
  const hasFetched = useRef(false);
  const cacheKey = 'categoriesCache';
  
  useEffect(() => {
    if (categories.status || hasFetched.current) {
      return;
    }
    
    const fetchCategories = async () => {
      hasFetched.current = true;
      
      // Check cache first
      const cachedData = localStorage.getItem(cacheKey);
      if (cachedData) {
        try {
          const parsedData = JSON.parse(cachedData);
          // Check if cache is less than 1 hour old
          const cacheTime = localStorage.getItem(`${cacheKey}_time`);
          if (cacheTime && Date.now() - parseInt(cacheTime) < 3600000) {
            dispatch(categoriesAction.getCategory(parsedData));
            return; // Use cache
          }
        } catch (error) {
          console.warn("Failed to parse cached categories");
        }
      }
      
      try {
        const response = await axios.get(`${config.API_URL}/category`, {
          timeout: 10000
        });
        
        if (response.data) {
          // Cache the response
          localStorage.setItem(cacheKey, JSON.stringify(response.data));
          localStorage.setItem(`${cacheKey}_time`, Date.now().toString());
          
          dispatch(categoriesAction.getCategory(response.data));
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
        
        // Use cached data even if expired
        if (cachedData) {
          try {
            const parsedData = JSON.parse(cachedData);
            dispatch(categoriesAction.getCategory(parsedData));
          } catch {
            // Dispatch empty
            dispatch(categoriesAction.getCategory({
              categories: [],
              status: true
            }));
          }
        } else {
          dispatch(categoriesAction.getCategory({
            categories: [],
            status: true
          }));
        }
      }
    };
    
    // Delay request to prevent race conditions
    const timer = setTimeout(() => {
      fetchCategories();
    }, 500);
    
    return () => clearTimeout(timer);
  }, [categories.status, dispatch]);
  
  return null;
}
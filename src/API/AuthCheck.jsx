// import { useEffect } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import axios from "axios";
// import config from "../Config/config.json";
// import { AboutAction } from "../store/About/AboutSlice";
// import { AuthCheckAction } from "../store/Auth/AuthCheckSlice";

// export default function AuthCheck() {
//   const AuthCheck = useSelector((store) => store.authcheck);
//   const token = localStorage.getItem("token");

//   const dispatch = useDispatch();

//   useEffect(() => {
//     if (AuthCheck.status || !token) return;

//     try {
//       const res = axios.get(`${config.API_URL}/auth/verify-token/${token}`);
//       dispatch(AuthCheckAction.addauth({ status: true }));
//     } catch (error) {
//       dispatch(AuthCheckAction.addauth({ status: false }));
//     }
//   }, [AuthCheck.status]);
// }


import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import config from "../Config/config.json";
import { AuthCheckAction } from "../store/Auth/AuthCheckSlice";

export default function AuthCheck() {
  const AuthCheck = useSelector((store) => store.authcheck);
  const dispatch = useDispatch();
  const hasChecked = useRef(false);
  
  useEffect(() => {
    // Skip if already checked or checking
    if (AuthCheck.status || hasChecked.current) {
      return;
    }
    
    const token = localStorage.getItem("token");
    
    // No token means not authenticated
    if (!token) {
      dispatch(AuthCheckAction.addauth({ status: false }));
      hasChecked.current = true;
      return;
    }
    
    const verifyToken = async () => {
      hasChecked.current = true;
      
      try {
        const response = await axios.get(`${config.API_URL}/auth/verify-token/${token}`, {
          timeout: 8000
        });
        
        if (response.status === 200) {
          dispatch(AuthCheckAction.addauth({ status: true }));
        } else {
          // Token invalid
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          dispatch(AuthCheckAction.addauth({ status: false }));
        }
      } catch (error) {
        console.error("Auth verification error:", error);
        
        // On network errors, check token format
        if (token && token.length > 10) {
          // Assume token is valid for now (offline mode)
          dispatch(AuthCheckAction.addauth({ status: true }));
        } else {
          dispatch(AuthCheckAction.addauth({ status: false }));
        }
      }
    };
    
    // Small delay to prevent race conditions
    setTimeout(verifyToken, 300);
  }, [AuthCheck.status, dispatch]);
  
  return null;
}

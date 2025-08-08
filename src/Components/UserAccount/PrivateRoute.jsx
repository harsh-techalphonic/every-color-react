import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import config from "../../Config/config.json";

const PrivateRoute = ({ children }) => {
  const [redirectPlease, setRedirectPlease] = useState(false);
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/auth/verify-token/${token}`);
        setRedirectPlease(false);
      } catch (error) {
        setRedirectPlease(true);
      }
    };
    checkAuth();
  }, []);
  if (redirectPlease) {
    localStorage.removeItem('token');
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default PrivateRoute;

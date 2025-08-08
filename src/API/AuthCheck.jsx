import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import config from "../Config/config.json";
import { AboutAction } from "../store/About/AboutSlice";
import { AuthCheckAction } from "../store/Auth/AuthCheckSlice";

export default function AuthCheck() {
  const AuthCheck = useSelector((store) => store.authcheck);
  const token = localStorage.getItem("token");

  const dispatch = useDispatch();

  useEffect(() => {
    if (AuthCheck.status || !token) return;

    try {
      const res = axios.get(`${config.API_URL}/auth/verify-token/${token}`);
      dispatch(AuthCheckAction.addauth({ status: true }));
    } catch (error) {
      dispatch(AuthCheckAction.addauth({ status: false }));
    }
  }, [AuthCheck.status]);
}

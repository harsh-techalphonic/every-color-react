import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { maxDicountProductAction } from "../store/HomesSection/maxDicountProductSlice";

export default function MaxDicountProductAPi() {
  const maxDicountProduct = useSelector((store) => store.maxDicountProduct);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (maxDicountProduct.status) return;
    axios
      .get(`${config.API_URL}/maxDicountProduct`)
      .then(function (response) {
        dispatch(maxDicountProductAction.addMaxDicountProduct(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [maxDicountProduct.status]);
  return true;
}

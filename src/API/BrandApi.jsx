import axios from "axios";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { brandsAction } from "../store/Brands/BrandSlice";

export default function BrandApi() {
  const brands = useSelector((store) => store.brands);
  const dispatch = useDispatch();

  useEffect(() => {
    if (brands.status) return;

    axios
      .get(`${config.API_URL}/add-brand`)
      .then((response) => {
        dispatch(brandsAction.getBrands(response.data));
      })
      .catch((error) => {
        console.error("Error fetching brands:", error);
      });
  }, [brands.status, dispatch]);

  return null;
}

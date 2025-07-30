import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { categoriesAction } from "../store/Categories/categoriesSlice";
export default function CategoriesApi() {
  const categories = useSelector((store) => store.categories);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (categories.status) return;
    axios
      .get(`${config.API_URL}/category`)
      .then(function (response) {
        dispatch(categoriesAction.getCategory(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [categories.status]);
  return true;
}

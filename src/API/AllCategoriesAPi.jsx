import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { allCategoriesAction } from "../store/Categories/allCategoriesSlice";
export default function AllCategoriesAPi() {
  const allCategories = useSelector((store) => store.allCategories);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (allCategories.status) return;
    axios
      .get(`${config.API_URL}/allCatWithSub`)
      .then(function (response) {
        dispatch(allCategoriesAction.getCategory(response.data.category));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [allCategories.status]);
  return true;
}

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { productsAction } from "../store/Products/productsSlice";
export default function ProductsApi() {
  const products = useSelector((store) => store.products);
  const dispatch = useDispatch();
  useEffect(() => {
    if (products.status) return;
    axios
      .get(`${config.API_URL}/product`)
      .then(function (response) {
        dispatch(productsAction.getProduct(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [products.status]);
  return true;
}

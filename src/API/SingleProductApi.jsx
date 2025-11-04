import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { productsAction } from "../store/Products/productsSlice";
import { useParams } from "react-router-dom";
import { singleProductAction } from "../store/Products/singleProductSlice";
export default function SingleProductApi() {
  const singleProduct = useSelector((store) => store.singleProduct);
  const dispatch = useDispatch();
  const { slug } = useParams();
  useEffect(() => {
    if(singleProduct.find((product) => product?.product_slug === slug)) return;
    axios
      .get(`${config.API_URL}/products/${slug}`)
      .then(function (response) {
        dispatch(singleProductAction.addProduct(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [slug]);
  return true;
}

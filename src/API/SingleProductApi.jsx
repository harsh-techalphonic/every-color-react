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
    if(singleProduct.find((product) => product.slug === slug)) return;
    axios
      .get(`${config.API_URL}/product/${slug}`)
      .then(function (response) {
        // console.log(response.data.gallertImageUrl)
        dispatch(singleProductAction.addProduct({
          ...response.data.product,
          product_attributes:response.data.product_attributes,
          product_inventory_details:response.data.product_inventory_details,
          related_products:response.data.related_products,
          gallertImageUrl : response.data.gallertImageUrl
        }));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [slug]);
  return true;
}

import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { testimonialAction } from "../store/HomesSection/TestimonialSlice";

export default function TestimonialApi() {
  const testimonials = useSelector((store) => store.testimonials);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (testimonials.status) return;
    axios
      .get(`${config.API_URL}/web/section/home-testimonials`)
      .then(function (response) {
        // console.log("testimonials", response)
        dispatch(testimonialAction.getInfo(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [testimonials.status]);
  return true;
}

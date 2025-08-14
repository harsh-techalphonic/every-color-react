import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { pressAction } from "../store/HomesSection/PressSlice";

export default function PressApi() {
  const press = useSelector((store) => store.press);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (press.status) return;
    axios
      .get(`${config.API_URL}/web/section/in-press-slide`)
      .then(function (response) {
        // console.log("press", response)
        dispatch(pressAction.getInfo(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [press.status]);
  return true;
}

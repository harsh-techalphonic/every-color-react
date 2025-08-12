import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import config from "../Config/config.json";
import { basicInfoAction } from "../store/HomesSection/basicInfoSlice";

export default function BasicInfoApi() {
  const basicInfo = useSelector((store) => store.basicInfo);
  const dispatch = useDispatch();
  
  useEffect(() => {
    if (basicInfo.status) return;
    axios
      .get(`${config.API_URL}/web/desktop/banner-bottom`)
      .then(function (response) {
        console.log("basicInfo", response)
        dispatch(basicInfoAction.getInfo(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [basicInfo.status]);
  return true;
}

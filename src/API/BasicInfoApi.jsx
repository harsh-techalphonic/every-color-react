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
      .get(`${config.API_URL}/basic-info`)
      .then(function (response) {
        dispatch(basicInfoAction.getInfo(response.data.data[0]));
      })
      .catch(function (error) {
        console.log(error);
      });
  }, [basicInfo.status]);
  return true;
}

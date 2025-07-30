import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../Config/config.json';
import { AboutAction } from '../store/About/AboutSlice';


export default function AboutApi() {
    const About = useSelector((store) => store.About);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (About.status) return;
  
      axios.get(`${config.API_URL}/about-page`)
    .then((response) => {
      dispatch(AboutAction.getInfo(response.data));
    })
        .catch((error) => {
          console.error('Error fetching About data:', error);
        });
    }, [About.status]);
  }

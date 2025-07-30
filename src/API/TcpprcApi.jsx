import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../Config/config.json';
import { TcpprcAction } from '../store/Tcpprc/TcpprcSlice';

export default function TcpprcApi() {
  const tcpprc = useSelector((store) => store.Tcpprc);
  const dispatch = useDispatch();

  useEffect(() => {
    if (tcpprc.status) return;

    axios.get(`${config.API_URL}/static-page`)
  .then((response) => {
    dispatch(TcpprcAction.getInfo(response.data));
  })
      .catch((error) => {
        console.error('Error fetching TCPPRC data:', error);
      });
  }, [tcpprc.status]);
}

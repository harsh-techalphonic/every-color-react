import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import config from '../Config/config.json';
import { ContactAction } from '../store/Contact/ContactSlice';

export default function ContactApi() {
    const Contact = useSelector((store) => store.Contact);
    const dispatch = useDispatch();
  
    useEffect(() => {
      if (Contact.status) return;
  
      axios.get(`${config.API_URL}/contact-info-items`)
    .then((response) => {
      dispatch(ContactAction.getInfo(response.data));
    })
        .catch((error) => {
          console.error('Error fetching Contact data:', error);
        });
    }, [Contact.status]);
}





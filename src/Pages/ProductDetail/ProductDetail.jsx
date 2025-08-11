import React, { useEffect, useState } from 'react';
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import Product_detail from '../../Components/ProductDetail/Product_detail';
import Product_descrtiption from '../../Components/ProductDetail/Product_descrtiption';
import SimilarProducts from '../../Components/ProductDetail/SimilarProducts';
import ReviewRating from '../../Components/ProductDetail/ReviewRating';
import RecentlyViewed from '../../Components/ProductDetail/RecentlyViewed';
import SingleProductApi from '../../API/SingleProductApi';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ScrollToTop from '../ScrollToTop';
import axios from 'axios';
import config from '../../Config/config.json';

export default function ProductDetail() {
  const fetch_singleProduct = useSelector((store) => store.singleProduct);
  const [singleProduct, setSingleProduct] = useState(false);
  const { slug } = useParams();

  useEffect(() => {
    if (fetch_singleProduct.length === 0) return;

    const existingProduct = fetch_singleProduct.find(
      (product) => product.product_slug === slug
    );

    if (existingProduct) {
      setSingleProduct(existingProduct);
    }
  }, [fetch_singleProduct, slug]);

  // Send product_id to API when singleProduct changes
  useEffect(() => {
    if (!singleProduct || !singleProduct.id) return;

    const sendRecentView = async () => {
      try {
        const token = localStorage.getItem('token'); // Get token from localStorage
        if (!token) {
          console.warn('No token found. Skipping recent view API call.');
          return;
        }

        // POST request with product_id in query params
        const response = await axios.post(
          `${config.API_URL}/add-recent-view?product_id=${singleProduct.id}`,
          {}, // No body needed since product_id is in query params
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log('Recent view added:', response.data);
      } catch (error) {
        console.error('Error adding recent view:', error);
      }
    };

    sendRecentView();
  }, [singleProduct]);

  return (
    <>
      <ScrollToTop />
      <Header />
      <SingleProductApi />
      {singleProduct ? (
        <>
          <Product_detail singleProduct={singleProduct} />
          <Product_descrtiption singleProduct={singleProduct} />
          <ReviewRating singleProduct={singleProduct} />
          <SimilarProducts singleProduct={singleProduct} />
          <RecentlyViewed  />
        </>
      ) : (
        <>Hello</>
      )}
      <Footer />
    </>
  );
}

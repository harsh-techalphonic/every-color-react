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
import RecentViewApi from '../../API/RecentViewApi';
import './ProductLoader.css';

// Simple Loader Skeleton Component
const ProductLoader = () => {
  return (
    <div className="product-loader">
      <div className="image-loader"></div>
      <div className="product-info">
        <div className="title-loader"></div>
        <div className="price-loader"></div>
        <div className="availability-loader"></div>
        <div className="button-loader">
          <div className="add-to-cart-loader"></div>
          <div className="buy-now-loader"></div>
        </div>
      </div>
    </div>
  );
};


export default function ProductDetail() {
  const fetch_singleProduct = useSelector((store) => store.singleProduct);
  const [singleProduct, setSingleProduct] = useState(false);
  const { slug } = useParams();

const token = localStorage.getItem('token');
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

        await axios.post(
          `${config.API_URL}/add-recent-view?product_id=${singleProduct.id}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
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
      <RecentViewApi />
      {singleProduct ? (
        <>
          <Product_detail singleProduct={singleProduct} />
          <Product_descrtiption singleProduct={singleProduct} />
          <ReviewRating singleProduct={singleProduct} />
          <SimilarProducts singleProduct={singleProduct} />
          {token && <RecentlyViewed singleProduct={singleProduct} />}
        </>
      ) : (
        <ProductLoader />
      )}
      <Footer />
    </>
  );
}

import React, { useEffect, useState } from 'react'
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


export default function ProductDetail() {
    const fetch_singleProduct = useSelector((store) => store.singleProduct);
    const [singleProduct, setSingleProduct] = useState(false);
    const { slug } = useParams();
    
    useEffect(() => {
      if(fetch_singleProduct.length == 0) return;
      const existingProduct = fetch_singleProduct.find(
        (product) => product.slug === slug
      );
  
      if (existingProduct) {
        // console.log(existingProduct)
        setSingleProduct(existingProduct)
      }
    }, [fetch_singleProduct]);
  return (
   <>
   <ScrollToTop/>
    <Header/>
    <SingleProductApi/>
    {singleProduct ? <>
      <Product_detail singleProduct={singleProduct}/>
    <Product_descrtiption singleProduct={singleProduct}/>
    <ReviewRating singleProduct={singleProduct}/>
    <SimilarProducts singleProduct={singleProduct}/>
    {/* <RecentlyViewed singleProduct={singleProduct}/> */}
    </> : <>Hello</>}
    <Footer/>
    </>
  );
}
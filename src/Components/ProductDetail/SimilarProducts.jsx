import React from 'react'
import Slider from "react-slick";
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SingleProductSlide from '../Product/SingleProductSlide';
import { useSelector } from 'react-redux';

export default function SimilarProducts({ singleProduct }) {

  const fetch_products = useSelector((store) => store.products) || { data: [], status: false };

  // Filter products: same category, exclude the current product
  const products = fetch_products.data?.filter(
    (product) =>
      product.product_cat_id === singleProduct?.product_cat_id &&
      product.id !== singleProduct?.id
  ) || [];

  var settings = {
    dots: false,
    infinite: products.length > 1,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: products.length > 1,
    arrows: products.length > 1,
    autoplay: products.length > 1,
    autoplaySpeed: 3000,
    centerMode: products.length < 5, 
     centerPadding: products.length < 5 ? "0px" : "0px", 
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, centerMode: products.length < 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3, centerMode: products.length < 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2, centerMode: products.length < 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2, centerMode: products.length < 2 } },
      { breakpoint: 360, settings: { slidesToShow: 1, centerMode: false } },
    ],
  };

   if (products.length === 0) {
    return null;
  }

  return (
    
    <section className='Best_selling my-5'>
      <div className='container'>
        <div className='feature-product-tile d-flex align-items-center justify-content-between'>
          <div className='title-box'>
            <h2><span>Similar</span> Products</h2>
          </div>
        </div>

        <div className='featureslider_one my-4'>
          <Slider {...settings} className="xyzg-slider">
            {products.map((product) => (
              <SingleProductSlide key={product.id} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  )
}

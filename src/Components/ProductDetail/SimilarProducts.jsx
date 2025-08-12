import React from 'react'
import Slider from "react-slick";

import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SingleProductSlide from '../Product/SingleProductSlide';
import { useSelector } from 'react-redux';

export default function SimilarProducts({ singleProduct }) {

  const fetch_products = useSelector((store) => store.products) || { data: [], status: false };
  console.log("similar all product", fetch_products.data);
  console.log("first", singleProduct)

  // Filter products: same category, exclude the current product
  const products = fetch_products.data?.filter(
    (product) =>
      product.product_cat_id === singleProduct?.product_cat_id &&
      product.id !== singleProduct?.id
  ) || [];


  var settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1 } },
    ],
  };


  return (
    <section className='Best_selling my-5'>
      <div className='container'>
        <div className='feature-product-tile d-flex align-items-center justify-content-between'>
          <div className='title-box'>
            <h2><span>Similar</span> Products</h2>
          </div>
          {/* <div className='title-box'>
            <a href="/product">View All <FontAwesomeIcon icon={faArrowRightLong} /></a>
          </div> */}
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

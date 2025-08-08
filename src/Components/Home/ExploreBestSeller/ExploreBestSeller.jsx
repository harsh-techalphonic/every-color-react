import React from 'react'
import Slider from 'react-slick';
// import './SuperSaving.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import ExploreBestSellerCard from './ExploreBestSellerCard';

export default function ExploreBestSeller() {
  const fetch_products = useSelector((store) => store.products);
      var settings = {
        dots: false,
        infinite: true,
        speed: 500,
        slidesToShow: 5,
        slidesToScroll: 1,
        arrows: false,
        autoplay: true,
        autoplaySpeed: 3000,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 4,
            },
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 3,
            },
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 2,
            },
          },
          {
            breakpoint: 480,
            settings: {
              slidesToShow: 1,
            },
          },
        ],
      };
  return (
    <section className='Super_saving my-5'>
        <div className='container'>
            <div className='feature-product-tile d-flex align-items-center justify-content-between'>
              <div className='title-box'>
                <h2><span>Explore </span>  Bestsellers</h2>
              </div>
              <div className='title-box'>
                <Link to="/product">View All <FontAwesomeIcon icon={faArrowRightLong}/></Link>
              </div>
            </div>            

            <div className='featureslider_one my-4'>
            <Slider {...settings} className="xyzg-slider">
              {fetch_products.data.filter(e => e.type == 2).map((product,index) => (
                            <ExploreBestSellerCard key={index} product={product}/>
                          ))}
            </Slider>
            </div>
        </div>
      </section>
  )
}

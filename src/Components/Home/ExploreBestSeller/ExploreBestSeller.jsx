import React, { useEffect, useState } from 'react';
import Slider from 'react-slick';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import ExploreBestSellerCard from './ExploreBestSellerCard';
import config from '../../../Config/config.json'

export default function ExploreBestSeller() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch(`${config.API_URL}/web/section/our-client`)
      .then((res) => res.json())
      .then((data) => {
      
        if (data && data) {
          setProducts(data);
        }
      })
      .catch((err) => console.error('Error fetching data:', err));
  }, []);

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
      { breakpoint: 1200, settings: { slidesToShow: 4 } },
      { breakpoint: 992, settings: { slidesToShow: 3 } },
      { breakpoint: 768, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 2 } },
      { breakpoint: 360, settings: { slidesToShow: 1 } },
    ],
  };

  return (
    <section className="Super_saving my-5">
      <div className="container">
        <div className="feature-product-tile d-flex align-items-center justify-content-between">
          <div className="title-box">
            <h2>
              <span>Explore </span> Bestsellers
            </h2>
          </div>
          <div className="title-box">
            <Link to="/product">
              View All <FontAwesomeIcon icon={faArrowRightLong} />
            </Link>
          </div>
        </div>

        <div className="featureslider_one my-4">
          <Slider {...settings} className="xyzg-slider">
            {products.length > 0 ? (
              products.map((product, index) => (
                <ExploreBestSellerCard key={index} product={product} />
              ))
            ) : (
              <p>Loading...</p>
            )}
          </Slider>
        </div>
      </div>
    </section>
  );
}

import React from 'react'
import Slider from "react-slick";
import './SuperSaving.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SingleProductSlide from '../../Product/SingleProductSlide';

export default function SuperSaving() {
  const fetch_products = useSelector((store) => store.products);

  // defensive guard
  const allProducts = Array.isArray(fetch_products?.data) ? fetch_products.data : [];

  // filter new arrivals (and optionally only active status)
  const newArrivals = allProducts.filter(
    (p) => p.home_type === "new_arrivals" && String(p.status) === "1"
  );

  const settings = {
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

  if (!fetch_products?.status) {
    return (
      <section className="Best_selling my-5">
        <div className="container">
          <div>Loading products...</div>
        </div>
      </section>
    );
  }

  if (newArrivals.length === 0) {
    return (
      <section className="Best_selling my-5">
        <div className="container">
          <div className="feature-product-tile d-flex align-items-center justify-content-between">
            <div className="title-box">
              <h2>
                <span>new Arrivals </span> Products
              </h2>
            </div>
            <div className="title-box">
              <Link to="/product">
                View All <FontAwesomeIcon icon={faArrowRightLong} />
              </Link>
            </div>
          </div>
          <div className="my-4">No new arrivals available.</div>
        </div>
      </section>
    );
  }

  return (
    <section className="Best_selling my-5">
      <div className="container">
        <div className="feature-product-tile d-flex align-items-center justify-content-between">
          <div className="title-box">
            <h2>
              <span>Best</span> Selling
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
            {newArrivals.map((product, index) => (
              <SingleProductSlide key={product.id || index} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

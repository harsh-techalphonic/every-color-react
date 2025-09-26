import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  faArrowRightLong,
  faBagShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SingleProductSlide from "../Product/SingleProductSlide";
import RecentViewApi from "../../API/RecentViewApi";

export default function RecentlyViewed() {
  // Safely select Redux state
  const fetch_singleProduct = useSelector((store) => store.singleProduct?.data || []);
  const products = useSelector((store) => store.recentView?.products || []);
const dispatch = useDispatch(); 
  const [singleProduct, setSingleProduct] = useState(null);
  // console.log("recently viewed", products)
  const { slug } = useParams();

  useEffect(() => {
    if (!Array.isArray(fetch_singleProduct) || fetch_singleProduct.length === 0) return;

    const existingProduct = fetch_singleProduct.find(
      (product) => product.product_slug === slug
    );

    if (existingProduct) {
      setSingleProduct(existingProduct);
    }
  }, [fetch_singleProduct, slug]);

  // const [wishlist, setWishlist] = useState({});

  // const toggleWishlist = (id) => {
  //   setWishlist((prev) => ({
  //     ...prev,
  //     [id]: !prev[id],
  //   }));
  // };

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
      useEffect(() => {
      RecentViewApi(dispatch);
    }, [dispatch]);

  return (
    <section className="Best_selling my-5">
      <div className="container">
        <div className="feature-product-tile d-flex align-items-center justify-content-between">
          <div className="title-box">
            <h2>
              <RecentViewApi />
              <span>Recently</span> Viewed
            </h2>
          </div>
          {/* <div className="title-box">
            <a href="#!">
              View All <FontAwesomeIcon icon={faArrowRightLong} />
            </a>
          </div> */}
        </div>

        <div className="featureslider_one my-4">
          <Slider {...settings} className="xyzg-slider">
            {products.map((product, index) => (
              <SingleProductSlide key={product?.id} product={product} />
            ))}
          </Slider>
        </div>
      </div>
    </section>
  );
}

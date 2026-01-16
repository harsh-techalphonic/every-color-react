import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import "./DealsOfDay.css";
import {useParams } from "react-router-dom";
import SingleProductSlide from "../../Product/SingleProductSlide";
import { useDispatch, useSelector } from "react-redux";
import RecentViewApi from "../../../API/RecentViewApi";

export default function DealsOfDay() {
  const fetch_singleProduct = useSelector(
    (store) => store.singleProduct?.data || []
  );
  const products = useSelector((store) => store.recentView?.products || []);
 
  const dispatch = useDispatch();
  const [singleProduct, setSingleProduct] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (!Array.isArray(fetch_singleProduct) || fetch_singleProduct.length === 0)
      return;

    const existingProduct = fetch_singleProduct.find(
      // console.log('slug',slug)
      (product) => product?.product_slug === slug
    );
console.log('slug',slug)
    if (existingProduct) {
      setSingleProduct(existingProduct);
    }
  }, [fetch_singleProduct, slug]);

  // var settings = {
  //   dots: false,
  //   infinite: true,
  //   speed: 500,
  //   slidesToShow: 5,
  //   slidesToScroll: 1,
  //   swipeToSlide: true,
  //   arrows: false,
  //   autoplay: true,
  //   autoplaySpeed: 3000,
  //   responsive: [
  //     { breakpoint: 1200, settings: { slidesToShow: 4 } },
  //     { breakpoint: 992, settings: { slidesToShow: 3 } },
  //     { breakpoint: 768, settings: { slidesToShow: 2 } },
  //     { breakpoint: 576, settings: { slidesToShow: 2 } },
  //     { breakpoint: 360, settings: { slidesToShow: 1 } },
  //   ],
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
    <>
      {Array.isArray(products) && products.length > 0 && (
        <section className="DealOf_Day my-5">
          <div className="container">
            <div className="feature-product-tile d-flex align-items-center justify-content-between">
              <div className="title-box">
                <h2>
                  <span>Recently</span> Viewed
                </h2>
              </div>
            </div>

            <div className="featureslider_one my-4">
              <Slider {...settings} className="xyzg-slider">
                {products
                  ?.filter((product) => product)
                  .map((product, index) => (
                    <div key={product.id || index}>
                      <SingleProductSlide product={product} />
                    </div>
                  ))}
              </Slider>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

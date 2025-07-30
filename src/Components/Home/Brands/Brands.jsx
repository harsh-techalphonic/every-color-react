import React, { useEffect, useState } from "react";
import "./Brands.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import BrandApi from "../../../API/BrandApi";
import { Link } from "react-router-dom";

export default function Brands() {
  const { data, brandImageUrl } = useSelector((store) => store.brands);
  console.log("brands", data[0]?.image?.path)
  
    var settings = {
      dots: false,
      speed: 500,
      slidesToShow: 6,
      slidesToScroll: 1,
      arrows: false,
      autoplay: true,
      autoplaySpeed: 3000,
      centerMode: false, 
      responsive: [
        {
          breakpoint: 1400,
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
      <section className="Shop_by_health brands">
        <BrandApi/>
        <div className="container">
          <div className="feature-product-tile d-flex align-items-center justify-content-between">
            <div className="title-box">
              <h2>Brands </h2>
            </div>
          </div>
          <Slider {...settings} className="xyzg-slider">
            {data.map((item) => (
              <div key={item.id} className="Shop_by_health-card">
                <Link to={`/product/brand/${item.slug}`}>
                <div className="card-img">
                  <img src={`${brandImageUrl}/${item?.image?.path}`} alt={item?.image?.alt} />
                </div>
                </Link>
              </div>
            ))}
          </Slider>
        </div>
      </section>
    );
  }

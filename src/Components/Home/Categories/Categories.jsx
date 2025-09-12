import React, { useEffect, useState } from "react";
import "./Categories.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import CategoriesApi from "../../../API/CategoriesAPi";
import { Link } from "react-router-dom";
import CategoryCard from "./CategoryCard";

export default function Categories() {
  const fetch_categories = useSelector((store) => store.categories);
  const [categories, setCategory] = useState([])
  useEffect(() => {
      setCategory(fetch_categories.data)
  }, [fetch_categories.status]);

  var settings = {
    dots: false,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
     swipeToSlide: true,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: false,
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
        breakpoint: 576,
        settings: {
          slidesToShow: 2,
        },
      },
    ],
  };
  return (
    <section className="Shop_by_health ">
      <CategoriesApi/>
      <div className="container">
        <div className="feature-product-tile d-flex align-items-center justify-content-between">
          <div className="title-box">
            <h2>Categories </h2>
          </div>
        </div>
        <Slider {...settings} className="xyzg-slider">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} data={cat} uri={"category"}/>
          ))}
        </Slider>
      </div>
    </section>
  );
}

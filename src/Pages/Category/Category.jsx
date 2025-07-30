import React, { useEffect, useState } from "react";
// import "../../Components/Home/Categories/Categories.css";
import Slider from "react-slick";
import { useSelector } from "react-redux";
import CategoriesApi from "../../../src/API/CategoriesAPi";
import CategoryCard from "../../Components/Home/Categories/CategoryCard";
import Footer from "../../Components/Partials/Footer/Footer";
import Header from "../../Components/Partials/Header/Header";
import { useParams } from "react-router-dom";
import HotOffer from "../../Components/Home/HotOffer/HotOffer";

export default function Category() {
  const { category } = useParams();
    const fetch_categories = useSelector((store) => store.categories);
      const [categories, setCategory] = useState([])
      useEffect(() => {
          setCategory(fetch_categories.data)
      }, [fetch_categories.status]);
      console.log("caterri",categories)


      const categoryTitle = category?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

    return (
      <>
        <Header />

          <HotOffer/>

          <section className="Shop_by_health bg-white">
            <CategoriesApi/>
            <div className="container">
              <div className="feature-product-tile d-flex align-items-center justify-content-between">
                <div className="title-box">
                  <h2> {categoryTitle} Categories </h2>
                </div>
              </div>
              {/* <Slider {...settings} className="xyzg-slider">
                {categories.map((cat, idx) => (
                  <CategoryCard key={idx} data={cat}/>
                ))}
              </Slider> */}
                <div className="row">
                  {categories.map((cat, idx) => (
                      <div className="col-lg-3 col-md-4 col-sm-6 col-6">
                          <CategoryCard key={idx} data={cat}/>
                      </div>
                  ))}
                </div>
            </div>
          </section>

        <Footer />
      </>
  );
}

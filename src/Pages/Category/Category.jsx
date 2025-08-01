import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import HotOffer from "../../Components/Home/HotOffer/HotOffer";
import CategoryCard from "../../Components/Home/Categories/CategoryCard";

export default function Category() {
  const { category } = useParams();
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState("");

  const fetch_categories = useSelector((store) => store.categories);

  useEffect(() => {
    if (!fetch_categories.status) return;

    // Find the category object using slug
    const currentCategory = fetch_categories.data.find(
      (cat) => cat.slug === category
    );

    if (currentCategory) {
      setCategoryName(currentCategory.name);

      // Fetch sub-categories using the category ID
      axios
        .get(
          `https://dimgrey-eel-688395.hostingersite.com/api/category-with-sub-category/${currentCategory.id}`
        )
        .then((res) => {
          setSubCategories(res.data.sub_category || []);
        })
        .catch((err) => {
          console.error("Error fetching sub-categories", err);
        });
    }
  }, [category, fetch_categories]);

  // Capitalized title for display
  const categoryTitle = categoryName || category?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <>
      <Header />
      <HotOffer />

      <section className="Shop_by_health bg-white">
        <div className="container">
          <div className="feature-product-tile d-flex align-items-center justify-content-between">
            <div className="title-box">
              <h2>{categoryTitle} Categories</h2>
            </div>
          </div>

          <div className="row">
            {subCategories.map((sub, idx) => (
              <div key={idx} className="col-lg-3 col-md-4 col-sm-6 col-6">
                <CategoryCard data={sub} uri={"product"} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

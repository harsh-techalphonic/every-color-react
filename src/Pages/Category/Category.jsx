import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom"; 
import config from '../../Config/config.json'
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import HotOffer from "../../Components/Home/HotOffer/HotOffer";
import CategoryCard from "../../Components/Home/Categories/CategoryCard";
import HelmetComponent from "../../Components/HelmetComponent/HelmetComponent";
import logo from '../../assets/EveryColourLogo.png'

export default function Category({ onHeaderHeight }) {
  const { category } = useParams();
  const navigate = useNavigate(); 
  const [subCategories, setSubCategories] = useState([]);
  const [categoryName, setCategoryName] = useState(""); 
  const fetch_categories = useSelector((store) => store.categories);
   const [banner, setBanner] = useState({});  



  useEffect(() => {
    if (!fetch_categories.status) return;

    const currentCategory = fetch_categories.data.find(
      (cat) => cat.slug === category
    );

    if (currentCategory) {
      setCategoryName(currentCategory.name);

      axios
        .get(
          `${config.API_URL}/category-with-sub-category/${currentCategory.id}`
        )
        .then((res) => {
          setSubCategories(res.data.sub_category || []);
        })
        .catch((err) => {
          console.error("Error fetching sub-categories", err);
        });
    }
  }, [category, fetch_categories]);


  const categoryTitle =
    categoryName ||
    category?.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  // ✅ Handle card click
  // const handleCardClick = (subCatSlug) => {
  //   navigate(`/category/${categoryTitle}/${subCatSlug}`);
  // };
  
    // ✅ Handle card click
  const handleCardClick = (subCatSlug) => {
    navigate(`/product?category=${category}&subcategory=${subCatSlug}`);
  };

  const Uri= "category/:${currentCategory.name}/:${subCatSlug}"
  return (
    <>
      <Header onHeight={onHeaderHeight}/>

      <HelmetComponent
        title={banner?.meta_title}  
        description={banner?.meta_description}
        keywords={banner?.meta_keyword}
        image={logo}
      /> 

      <HotOffer uri={Uri} onSectionDataChange={setBanner} />

      <section className="Shop_by_health bg-white">
        <div className="container">
          <div className="feature-product-tile d-flex align-items-center justify-content-between">
            <div className="title-box">
              <h2>{categoryTitle} Categories</h2>
            </div>
          </div>

          <div className="row">
            {subCategories.map((sub, idx) => (
              <div
                key={idx}
                className="col-lg-3 col-md-4 col-sm-6 col-6 "
                onClick={() => handleCardClick(sub.slug)} // ✅ Click to navigate
                style={{ cursor: "pointer" }}
              >
                <CategoryCard data={sub} uri={Uri} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

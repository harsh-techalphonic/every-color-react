import React, { useEffect, useState } from "react";
import "./Product_filter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { filtersAction } from "../../../store/Products/filtersSlice";
import AllCategoriesAPi from "../../../API/AllCategoriesAPi";
import { Link } from "react-router-dom";
import BrandApi from "../../../API/BrandApi";

export default function ProductFilter({ products }) {
  const dispatch = useDispatch();
  const allCategories = useSelector((store) => store.allCategories);
  const { data } = useSelector((store) => store.brands);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [stepAmount, setStepAmount] = useState(300);

  const [fixedMinPrice, setFixedMinPrice] = useState(0);
  const [fixedMaxPrice, setFixedMaxPrice] = useState(0);

  useEffect(() => {
    if (products.status == false) return;
    const prices = products.data.map((product) => product.discount_price);
    setMinPrice(Math.min(...prices));
    setMaxPrice(Math.max(...prices));
    
    setFixedMinPrice(Math.min(...prices));
    setFixedMaxPrice(Math.max(...prices));
  }, [products.status]);

  useEffect(()=>{
    if(minPrice == 0) return;
    const timer = setTimeout(() => {
        // console.log("Min price updated:", minPrice);
        dispatch(filtersAction.priceRangeMin(minPrice));
    }, 500);
    return () => clearTimeout(timer);
},[minPrice]);

useEffect(()=>{
    if(maxPrice == 0) return;
    const timer = setTimeout(() => {
        // console.log("Max price updated:", maxPrice);
        dispatch(filtersAction.priceRangeMax(maxPrice));
    }, 500);
    return () => clearTimeout(timer);
  },[maxPrice]);

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - stepAmount);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + stepAmount);
    setMaxPrice(value);
  };

  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="filter-categoy my-4">
      <div className="card categories-card mb-3">
        <div className="categories-header">Categories</div>
        <div className="list-group">
          <AllCategoriesAPi/>
          {allCategories.data.map((category, index) => (
            <div
              key={index}
              className={`flex-wrap category-item ${
                activeIndex === index ? "active" : ""
              }`}
            >
              <div
                className="accordion-header d-flex w-100 justify-content-between align-items-center"
                onClick={() => toggleAccordion(index)}
              >
                <span>{category.name}</span>
                <FontAwesomeIcon
                  icon={activeIndex === index ? faAngleDown : faAngleRight}
                />
              </div>
              {activeIndex === index && category.sub_categories.length > 0 && (
                <div className="accordion-body mt-1">
                  <ul className="list-unstyled mb-0 ms-3">
                    {category.sub_categories.map((sub, subIndex) => (
                      <li key={subIndex}><Link to={`/category/${category.slug}/${sub.slug}`}>{sub.name}</Link></li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
          
      <div className="card categories-card brnads mb-3">
        <div className="categories-header">Brands</div>
        <div className="list-group">
          <BrandApi/>
          <ul className="list-unstyled mb-0">
            {data.map((item, index) => (
              <li key={index}><Link to={`/product/brands/${item?.image?.slug}`}>{item.name}</Link></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="card categories-card mb-3">
        <div className="categories-header">Price Range</div>
        <div className="list-group">
          <div className="d-flex filterrange_box">
            <div className="wrapper" style={{filter: `blur(${fixedMinPrice == 0 ? "5" : "0"}px)`}}>
              <div className="price-input">
                <div className="field">
                  <span style={{ whiteSpace: "nowrap" }}>Min : </span>
                  <input
                    type="number"
                    className="input-min"
                    value={minPrice}
                    onInput={handleMinChange}
                  />
                </div>
                <div className="separator">-</div>
                <div className="field">
                  <span style={{ whiteSpace: "nowrap" }}>Max : </span>
                  <input
                    type="number"
                    className="input-max"
                    value={maxPrice}
                    onInput={handleMaxChange}
                  />
                </div>
              </div>
              <div className="slider">
                <div
                  className="progress"
                  style={{
                    left: `${(minPrice / fixedMaxPrice) * 100}%`,
                    right: `${100 - (maxPrice / fixedMaxPrice) * 100}%`,
                  }}
                ></div>
              </div>
              <div className="range-input">
                <input
                  type="range"
                  className="range-min"
                  min={fixedMinPrice}
                  max={fixedMaxPrice}
                  value={minPrice}
                  step={stepAmount}
                  onChange={handleMinChange}
                />
                <input
                  type="range"
                  className="range-max"
                  min="0"
                  max={fixedMaxPrice}
                  value={maxPrice}
                  step={stepAmount}
                  onChange={handleMaxChange}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="card categories-card  mb-3">
        <div className="categories-header">Customer Ratings</div>
        <div className="list-group">
          <div className="rating-check-item ">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="5star"
              />
              <label className="form-check-label" htmlFor="5star">
                5 Star
              </label>
            </div>
          </div>
          <div className="rating-check-item ">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="4star"
              />
              <label className="form-check-label" htmlFor="4star">
                4 Star & above
              </label>
            </div>
          </div>
          <div className="rating-check-item ">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="3star"
              />
              <label className="form-check-label" htmlFor="3star">
                3 Star & above
              </label>
            </div>
          </div>
          <div className="rating-check-item ">
            <div className="form-check">
              <input
                className="form-check-input"
                type="checkbox"
                value=""
                id="2star"
              />
              <label className="form-check-label" htmlFor="2star">
                2 Star & above
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

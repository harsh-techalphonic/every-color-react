import React, { useEffect, useState, useRef } from "react";
import "./Product_filter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleDown, faAngleRight, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { filtersAction } from "../../../store/Products/filtersSlice";
import AllCategoriesAPi from "../../../API/AllCategoriesAPi";
import axios from "axios";
import { Link } from "react-router-dom";

const RATING_OPTIONS = [
  { label: "5 Star", value: 5 },
  { label: "4 Star & above", value: 4 },
  { label: "3 Star & above", value: 3 },
  { label: "2 Star & above", value: 2 },
];

export default function ProductFilter({ products }) {
  const dispatch = useDispatch();
  const categories = useSelector((store) => store.categories);

  const [subCategories, setSubCategories] = useState([]); // reserved if needed
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  const [stepAmount, setStepAmount] = useState(1); // smaller step to be more granular
  const [fixedMinPrice, setFixedMinPrice] = useState(0);
  const [fixedMaxPrice, setFixedMaxPrice] = useState(0);

  const [activeIndex, setActiveIndex] = useState(null);
  const [remoteSubCategories, setRemoteSubCategories] = useState({});
  const [loadingIndex, setLoadingIndex] = useState(null);
  const [errorIndex, setErrorIndex] = useState(null);

  const [selectedRating, setSelectedRating] = useState(null); // e.g., 4 means 4 & above

  const minTimerRef = useRef(null);
  const maxTimerRef = useRef(null);
  const ratingTimerRef = useRef(null);

  // Initialize price bounds when products change
  useEffect(() => {
    if (!products?.status) return;
    const rawPrices = (products.data || []).map(
      (p) => Number(p.product_discount_price ?? p.product_price ?? 0)
    );
    if (rawPrices.length === 0) return;
    const min = Math.min(...rawPrices);
    const max = Math.max(...rawPrices);
    setFixedMinPrice(min);
    setFixedMaxPrice(max);
    setMinPrice(min);
    setMaxPrice(max);
    // Adjust step: e.g., 1% of range but at least 1
    const range = max - min;
    setStepAmount(Math.max(1, Math.floor(range * 0.01)));
    // Dispatch initial range once
    dispatch(filtersAction.priceRangeMin(min));
    dispatch(filtersAction.priceRangeMax(max));
  }, [products?.status, products?.data]);

  // Debounced dispatch for minPrice
  useEffect(() => {
    if (minPrice == null) return;
    clearTimeout(minTimerRef.current);
    minTimerRef.current = setTimeout(() => {
      dispatch(filtersAction.priceRangeMin(minPrice));
    }, 300);
    return () => clearTimeout(minTimerRef.current);
  }, [minPrice]);

  // Debounced dispatch for maxPrice
  useEffect(() => {
    if (maxPrice == null) return;
    clearTimeout(maxTimerRef.current);
    maxTimerRef.current = setTimeout(() => {
      dispatch(filtersAction.priceRangeMax(maxPrice));
    }, 300);
    return () => clearTimeout(maxTimerRef.current);
  }, [maxPrice]);

  // Debounced dispatch for rating
  useEffect(() => {
    clearTimeout(ratingTimerRef.current);
    ratingTimerRef.current = setTimeout(() => {
      if (selectedRating == null) {
        dispatch(filtersAction.clearRating && filtersAction.clearRating()); // if you have a clear action
      } else {
        dispatch(filtersAction.rating(selectedRating)); // slice should interpret as ">= selectedRating"
      }
    }, 200);
    return () => clearTimeout(ratingTimerRef.current);
  }, [selectedRating]);

  const handleMinChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    // ensure at most maxPrice - stepAmount
    value = Math.min(value, maxPrice - stepAmount);
    value = Math.max(value, fixedMinPrice);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    // ensure at least minPrice + stepAmount
    value = Math.max(value, minPrice + stepAmount);
    value = Math.min(value, fixedMaxPrice);
    setMaxPrice(value);
  };

  const clearPriceFilters = () => {
    setMinPrice(fixedMinPrice);
    setMaxPrice(fixedMaxPrice);
    dispatch(filtersAction.priceRangeMin(fixedMinPrice));
    dispatch(filtersAction.priceRangeMax(fixedMaxPrice));
  };

  const handleRatingSelect = (val) => {
    if (selectedRating === val) {
      setSelectedRating(null); // toggle off
    } else {
      setSelectedRating(val);
    }
  };

  const clearRating = () => {
    setSelectedRating(null);
  };

  const toggleAccordion = (index, category) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(index);
    if ((!category.sub_category || category.sub_category.length === 0) && !remoteSubCategories[index]) {
      fetchSubCategories(index, category.id);
    }
  };

  const fetchSubCategories = async (index, categoryId) => {
    try {
      setLoadingIndex(index);
      setErrorIndex(null);
      const res = await axios.get(
        `https://dimgrey-eel-688395.hostingersite.com/api/category-with-sub-category/${categoryId}`
      );
      setRemoteSubCategories((prev) => ({
        ...prev,
        [index]: res.data.sub_category || [],
      }));
    } catch (err) {
      console.error("Error fetching sub-categories", err);
      setErrorIndex(index);
    } finally {
      setLoadingIndex(null);
    }
  };

  const getShownSubCategories = (category, index) => {
    if (Array.isArray(category.sub_category) && category.sub_category.length > 0) {
      return category.sub_category;
    }
    return remoteSubCategories[index] || [];
  };

  return (
    <div className="filter-categoy my-4">
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Categories</span>
        </div>
        <div className="list-group">
          <AllCategoriesAPi />
          {!categories.status && <div className="p-2">Loading categories...</div>}
          {categories.status &&
            categories.data.map((category, index) => {
              const showingSubs = getShownSubCategories(category, index);
              const hasSubs = showingSubs.length > 0;
              return (
                <div
                  key={category.id || index}
                  className={`flex-wrap category-item ${activeIndex === index ? "active" : ""}`}
                >
                  <div
                    className="accordion-header d-flex w-100 justify-content-between align-items-center"
                    onClick={() => toggleAccordion(index, category)}
                    style={{ cursor: "pointer" }}
                  >
                    <div className="d-flex align-items-center gap-2">
                      {category.image && (
                        <img
                          src={category.image}
                          alt={category.name}
                          style={{ width: 20, height: 20, objectFit: "cover", borderRadius: 3 }}
                        />
                      )}
                      <span>{category.name}</span>
                    </div>
                    <FontAwesomeIcon
                      icon={activeIndex === index ? faAngleDown : faAngleRight}
                    />
                  </div>
                  {activeIndex === index && (
                    <div className="accordion-body mt-1">
                      {loadingIndex === index && <div className="ms-3">Loading...</div>}
                      {errorIndex === index && (
                        <div className="ms-3 text-danger">Failed to load sub-categories.</div>
                      )}
                      {!loadingIndex && hasSubs && (
                        <ul className="list-unstyled mb-0 ms-3">
                          {showingSubs.map((sub) => (
                            <li key={sub.slug || sub.id}>
                              <Link to={`/category/${category.slug}/${sub.slug}`}>
                                {sub.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                      {!loadingIndex && !hasSubs && (
                        <div className="ms-3 text-muted">No sub-categories</div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
        </div>
      </div>

      {/* Price Range Filter */}
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Price Range</span>
          <button
            type="button"
            onClick={clearPriceFilters}
            className="btn btn-sm btn-link"
            aria-label="Clear price filters"
          >
            <FontAwesomeIcon icon={faXmark} /> Clear
          </button>
        </div>
        <div className="list-group p-2">
          <div className="d-flex flex-column gap-2 filterrange_box">
            <div className="d-flex justify-content-between">
              <div>
                <small>Min:</small>{" "}
                <input
                  type="number"
                  className="input-min"
                  value={minPrice}
                  onChange={handleMinChange}
                  min={fixedMinPrice}
                  max={fixedMaxPrice}
                />
              </div>
              <div>
                <small>Max:</small>{" "}
                <input
                  type="number"
                  className="input-max"
                  value={maxPrice}
                  onChange={handleMaxChange}
                  min={fixedMinPrice}
                  max={fixedMaxPrice}
                />
              </div>
            </div>

            <div className="slider position-relative" style={{ height: 8, marginTop: 8 }}>
              <div
                className="progress"
                style={{
                  left: `${((minPrice - fixedMinPrice) / Math.max(1, fixedMaxPrice - fixedMinPrice)) * 100}%`,
                  right: `${100 - ((maxPrice - fixedMinPrice) / Math.max(1, fixedMaxPrice - fixedMinPrice)) * 100}%`,
                  
                }}
              ></div>
            </div>

            <div className="range-input d-flex gap-2">
              <input
                type="range"
                className="range-min flex-grow-1"
                min={fixedMinPrice}
                max={fixedMaxPrice}
                value={minPrice}
                step={stepAmount}
                onChange={handleMinChange}
              />
              <input
                type="range"
                className="range-max flex-grow-1"
                min={fixedMinPrice}
                max={fixedMaxPrice}
                value={maxPrice}
                step={stepAmount}
                onChange={handleMaxChange}
              />
            </div>

            <div className="d-flex justify-content-between small">
              <div>₹{fixedMinPrice}</div>
              <div>₹{fixedMaxPrice}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Customer Ratings */}
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Customer Ratings</span>
          {selectedRating != null && (
            <button
              type="button"
              onClick={clearRating}
              className="btn btn-sm btn-link"
              aria-label="Clear rating"
            >
              <FontAwesomeIcon icon={faXmark} /> Clear
            </button>
          )}
        </div>
        <div className="list-group p-2">
          {RATING_OPTIONS.map(({ label, value }) => (
            <div className="rating-check-item" key={value}>
              <div className="form-check d-flex align-items-center">
                <input
                  className="form-check-input"
                  type="checkbox"
                  id={`rating-${value}`}
                  checked={selectedRating === value}
                  onChange={() => handleRatingSelect(value)}
                />
                <label className="form-check-label ms-2" htmlFor={`rating-${value}`}>
                  {label}
                </label>
              </div>
            </div>
          ))}
          {selectedRating != null && (
            <div className="mt-1 small text-muted">
              Filtering for {selectedRating} star{selectedRating > 1 ? "s" : ""} & above
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

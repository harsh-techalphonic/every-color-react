import React, { useEffect, useState, useRef } from "react";
import "./Product_filter.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import config from "../../../Config/config.json";
import Accordion from "react-bootstrap/Accordion";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const RATING_OPTIONS = [
  { label: "5 Star", value: 5 },
  { label: "4 Star & above", value: 4 },
  { label: "3 Star & above", value: 3 },
  { label: "2 Star & above", value: 2 },
];

export default function ProductFilter({ updateFilters }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const slug_category = searchParams.get("category");
  const slug_sub_category = searchParams.get("subcategory");

  const [categories, setCategories] = useState([]);

  // Price states
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [fixedMinPrice, setFixedMinPrice] = useState(null);
  const [fixedMaxPrice, setFixedMaxPrice] = useState(null);
  const [stepAmount] = useState(100);

  // Rating filter
  const [selectedRating, setSelectedRating] = useState(null);

  // Timers for debounce
  const minTimerRef = useRef(null);
  const ratingTimerRef = useRef(null);

  // Fetch categories
  useEffect(() => {
    axios
      .get(`${config.API_URL}/category-with-sub-category`)
      .then((response) => setCategories(response.data))
      .catch((error) => console.log(error));
  }, []);

  // Fetch dynamic min-max price
  useEffect(() => {
    const fetchPriceRange = async () => {
      try {
        const res = await axios.get(`${config.API_URL}/min-max-price`);
        if (res.data?.status) {
          let  min = parseFloat(res.data.min_price);
          let  max = parseFloat(res.data.max_price);

              min = min - 1;
              max = max + 1;

          setFixedMinPrice(min);
          setFixedMaxPrice(max);
          setMinPrice(min);
          setMaxPrice(max);

          updateFilters({ min_price: min, max_price: max });
        }
      } catch (err) {
        console.error("Failed to fetch min-max price:", err);
      }
    };
    fetchPriceRange();
  }, []);

  // Debounce price filter
  useEffect(() => {
    if (minPrice == null || maxPrice == null) return;
    clearTimeout(minTimerRef.current);
    minTimerRef.current = setTimeout(() => {
      updateFilters({ min_price: minPrice, max_price: maxPrice });
    }, 300);
    return () => clearTimeout(minTimerRef.current);
  }, [minPrice, maxPrice]);

  // Debounce rating filter
  useEffect(() => {
    clearTimeout(ratingTimerRef.current);
    ratingTimerRef.current = setTimeout(() => {
      updateFilters({ ratings: selectedRating });
    }, 200);
    return () => clearTimeout(ratingTimerRef.current);
  }, [selectedRating]);

  // Handlers
  const handleMinChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    value = Math.min(value, maxPrice - stepAmount);
    value = Math.max(value, fixedMinPrice);
    setMinPrice(value);
  };

  const handleMaxChange = (e) => {
    let value = Number(e.target.value);
    if (isNaN(value)) return;
    value = Math.max(value, minPrice + stepAmount);
    value = Math.min(value, fixedMaxPrice);
    setMaxPrice(value);
  };

 const clearPriceFilters = () => {
  setMinPrice(fixedMinPrice);
  setMaxPrice(fixedMaxPrice);
  updateFilters({ min_price: fixedMinPrice, max_price: fixedMaxPrice });
};

  const handleRatingSelect = (val) => {
    setSelectedRating(selectedRating === val ? null : val);
  };

  const clearRating = () => {
  setSelectedRating(null);
  updateFilters({ ratings: null }); // Make sure parent filter is also cleared
};

  const handleCategoryFilter = (category, sub_category = null) => {
    let query = `?category=${category}`;
    if (sub_category) query += `&subcategory=${sub_category}`;
    navigate(`/product${query}`);
  };

  const handleAccordionChange = (eventKey) => {
    if (eventKey === null) navigate(`/product`);
    else handleCategoryFilter(eventKey);
  };

  return (
    <div className="filter-categoy my-4 mb-5">
      {/* Categories Section */}
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Categories</span>
        </div>
        <div className="list-group">
          {categories.length === 0 && <div className="p-2">Loading categories...</div>}
          <Accordion
            defaultActiveKey={`${slug_category}`}
            onSelect={handleAccordionChange}
            className="category-item"
          >
            {categories.map((category, index) => (
              <Accordion.Item eventKey={category.slug} key={index}>
                <Accordion.Header className="accordion-header">
                  <div
                    className={`d-flex align-items-center min_change gap-2 ${
                      slug_category === category.slug ? "text-success fw-bold" : ""
                    }`}
                    style={{ cursor: "pointer" }}
                  >
                    {category.image && (
                      <img
                        src={category.image}
                        alt={category.name}
                        style={{ width: 25, height: 25, objectFit: "cover", borderRadius: 3 }}
                      />
                    )}
                    <span>{category.name}</span>
                  </div>
                </Accordion.Header>
                <Accordion.Body>
                  <ul className="list-unstyled mb-0">
                    {category.sub_category.map((subcat, subIndex) => (
                      <li
                        key={subIndex}
                        onClick={() => handleCategoryFilter(category.slug, subcat.slug)}
                        className={`mb-1 ${
                          slug_sub_category === subcat.slug ? "text-success fw-bold" : ""
                        }`}
                      >
                        {subcat.name}
                      </li>
                    ))}
                  </ul>
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Price Range Section */}
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Price Range</span>
          {/* Price Clear Button */}
{minPrice !== fixedMinPrice || maxPrice !== fixedMaxPrice ? (
  <button type="button" onClick={clearPriceFilters} className="btn btn-sm btn-link">
    <FontAwesomeIcon icon={faXmark} /> Clear
  </button>
) : null}
        </div>
        <div className="list-group p-2">
          {minPrice != null && maxPrice != null && (
            <div className="d-flex flex-column gap-2 filterrange_box">
              <div className="d-flex justify-content-between">
                <div>
                  <small>Min:</small>{" "}
                  <input
                    type="number"
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
                    right: `${
                      100 - ((maxPrice - fixedMinPrice) / Math.max(1, fixedMaxPrice - fixedMinPrice)) * 100
                    }%`,
                  }}
                ></div>
              </div>
              <div className="range-input d-flex gap-2">
                <input
                  type="range"
                  min={fixedMinPrice}
                  max={fixedMaxPrice}
                  value={minPrice}
                  step={stepAmount}
                  onChange={handleMinChange}
                />
                <input
                  type="range"
                  min={fixedMinPrice}
                  max={fixedMaxPrice}
                  value={maxPrice}
                  step={stepAmount}
                  onChange={handleMaxChange}
                />
              </div>
              <div className="d-flex justify-content-between small">
                <div>₹{minPrice}</div>
                <div>₹{maxPrice}</div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Ratings Section */}
      <div className="card categories-card mb-3">
        <div className="categories-header d-flex justify-content-between align-items-center">
          <span>Customer Ratings</span>
          {/* Rating Clear Button */}
{selectedRating != null && (
  <button type="button" onClick={clearRating} className="btn btn-sm btn-link">
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
                  id={value}
                  type="checkbox"
                  checked={selectedRating === value}
                  onChange={() => handleRatingSelect(value)}
                />
                <label className="form-check-label ms-2" htmlFor={value}>
                  {label}
                </label>
              </div>
            </div>
          ))}
          {selectedRating != null && (
            <div className="mt-1 small text-muted">Filtering for {selectedRating}★ & above</div>
          )}
        </div>
      </div>
    </div>
  );
}

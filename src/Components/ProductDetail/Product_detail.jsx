// IMPORTS
import React, { useEffect, useRef, useState } from "react";
import Slider from "react-slick";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy, faHeart } from "@fortawesome/free-regular-svg-icons";
import {
  faFacebook,
  faPinterest,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import { cartAction } from "../../store/Products/cartSlice";
import { useDispatch } from "react-redux";

// IMAGE URL FUNCTION
const getVariationImage = (filename) =>
  `https://dimgrey-eel-688395.hostingersite.com/uploads/${filename}`;

// MAIN COMPONENT
export default function Product_detail({ singleProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [productVar, setProductVar] = useState({});
  const [productVarSelected, setProductVarSelected] = useState({});
  const [productAmount, setProductAmount] = useState(false);
  const mainSliderRef = useRef(null);
  const navSliderRef = useRef(null);
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const dispatch = useDispatch();

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () =>
    setQuantity(quantity > 1 ? quantity - 1 : 1);

  useEffect(() => {
    if (localStorage.getItem("wishlist")) {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    }
    if (localStorage.getItem("cart")) {
      setaddTocart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    if (!singleProduct.variations?.variation_json) return;
    let variations;
    try {
      variations = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }

    if (
      Object.keys(productVarSelected).length === 0 ||
      Object.keys(productVar).length !== Object.keys(productVarSelected).length
    ) {
      setProductAmount(false);
      return;
    }

    const match = variations.find((v) =>
      Object.entries(productVarSelected).every(([key, val]) => v[key] === val)
    );
    setProductAmount(match);
  }, [productVarSelected]);

  useEffect(() => {
    if (!singleProduct.variations?.variation_json) return;
    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }

    const removeKeys = [
      "sale_price",
      "stock_status",
      "reguler_price",
      "image",
    ];
    const createAttr = {};

    variationArray.forEach((item) => {
      const filtered = Object.fromEntries(
        Object.entries(item).filter(([key]) => !removeKeys.includes(key))
      );

      for (const [key, value] of Object.entries(filtered)) {
        if (!createAttr[key]) {
          createAttr[key] = [];
        }
        createAttr[key].push(value);
      }
    });

    for (const key in createAttr) {
      createAttr[key] = [...new Set(createAttr[key])];
    }

    setProductVar(createAttr);
  }, []);

  const handleVariation = (type, value) => {
    const isSame = productVarSelected[type] === value;

    if (isSame) {
      const updated = { ...productVarSelected };
      delete updated[type];
      setProductVarSelected(updated);

      if (Object.keys(updated).length === 0) {
        let variationArray;
        try {
          variationArray = JSON.parse(singleProduct.variations.variation_json);
        } catch {
          return;
        }

        const allAttr = {};

        variationArray.forEach((item) => {
          const filteredEntry = Object.fromEntries(
            Object.entries(item).filter(
              ([key]) =>
                !["sale_price", "stock_status", "reguler_price", "image"].includes(
                  key
                )
            )
          );

          for (const [key, val] of Object.entries(filteredEntry)) {
            if (!allAttr[key]) {
              allAttr[key] = [];
            }
            allAttr[key].push(val);
          }
        });

        for (const key in allAttr) {
          allAttr[key] = [...new Set(allAttr[key])];
        }

        setProductVar(allAttr);
      }

      return;
    }

    setProductVarSelected((prev) => ({
      ...prev,
      [type]: value,
    }));

    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }

    const filtered = variationArray.filter((item) => item[type] === value);

    const removeKeys = [
      "sale_price",
      "stock_status",
      "reguler_price",
      "image",
      `${type}`,
    ];

    const createAttr = {};
    filtered.forEach((item) => {
      const filteredEntry = Object.fromEntries(
        Object.entries(item).filter(([key]) => !removeKeys.includes(key))
      );
      for (const [key, val] of Object.entries(filteredEntry)) {
        if (!createAttr[key]) {
          createAttr[key] = [];
        }
        createAttr[key].push(val);
      }
    });

    for (const key in createAttr) {
      createAttr[key] = [...new Set(createAttr[key])];
    }

    setProductVar((prev) => ({ ...prev, ...createAttr }));
  };

  const getImageSlides = () => {
    let variationArray = [];

    if (singleProduct.variations?.variation_json) {
      try {
        variationArray = JSON.parse(singleProduct.variations.variation_json);
      } catch {}
    }

    if (productVarSelected.color) {
      const matchedColorVariation = variationArray.find(
        (v) => v.color === productVarSelected.color && v.image
      );

      if (matchedColorVariation) {
        return [
          <div key="color-variation-image">
            <img
              src={getVariationImage(matchedColorVariation.image)}
              alt="Color Variation"
            />
          </div>,
        ];
      }
    }

    if (productAmount?.image) {
      return [
        <div key="variation-image">
          <img
            src={getVariationImage(productAmount.image)}
            alt="Selected Variation"
          />
        </div>,
      ];
    }

    return singleProduct.galleries.map((item, index) => (
      <div key={index}>
        <img src={item.image} alt={`Product ${index}`} />
      </div>
    ));
  };

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    fade: true,
    asNavFor: navSliderRef.current,
    ref: mainSliderRef,
  };

  const sliderNavSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: mainSliderRef.current,
    focusOnSelect: true,
    arrows: true,
    ref: navSliderRef,
  };

  const toggleCart = (id, variation) => {
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    const isInCart = cartItems.some((item) => item.prd_id === id);

    if (isInCart) {
      cartItems = cartItems.filter((item) => item.prd_id !== id);
      dispatch(cartAction.removeCart(cartItems));
    } else {
      const newItem = { quantity, prd_id: id, variation };
      cartItems = [newItem, ...cartItems];
      dispatch(cartAction.addCart(newItem));
    }

    setaddTocart(cartItems);
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  const submitAction = (formData) => {
    const variation = {};
    let quantity = null;
    let action_type = null;

    for (let [key, value] of formData.entries()) {
      if (key.startsWith("variation")) {
        const match = key.match(/\[\](\[(.*?)\])/);
        if (match && match[2]) {
          variation[match[2]] = value;
        }
      }

      if (key === "quantity") {
        quantity = value;
      }
      if (key === "action_type") {
        action_type = value;
      }
    }
    toggleCart(singleProduct.id, variation);
  };

  return (
    <div className="product-detail-slider-content my-5">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="product-galler-slide">
              <Slider {...sliderSettings} className="slider slider-for">
                {getImageSlides()}
              </Slider>
              <Slider {...sliderNavSettings} className="slider slider-nav">
                {getImageSlides()}
              </Slider>
            </div>
          </div>

          <div className="col-lg-5">
            <form action={submitAction} className="product-description">
              <h5>{singleProduct.product_name}</h5>

              <div className="my-3">
                <div className="rating d-flex align-items-center">
                  {[...Array(4)].map((_, i) => (
                    <FontAwesomeIcon key={i} icon={faStar} className="star-rating" />
                  ))}
                  <FontAwesomeIcon icon={faStarHalfAlt} className="star-rating" />
                  <span className="ms-2 rating-test d-flex align-items-center">
                    4.7 Star Rating <pre className="mb-0">(1,671 Users)</pre>
                  </span>
                </div>
              </div>

              {/* PRICING */}
              {productAmount ? (
                <div className="mt-2">
                  <span className="fw-bold fs-4 Pricing">₹{productAmount.sale_price}</span>
                  <span className="text-decoration-line-through text-muted ms-2">
                    ₹{productAmount.reguler_price}
                  </span>
                  <span className="discount ms-2">
                    {(
                      ((productAmount.reguler_price - productAmount.sale_price) /
                        productAmount.reguler_price) *
                      100
                    ).toFixed(0)}% OFF
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="fw-bold fs-4 Pricing">₹{singleProduct.product_discount_price}</span>
                  <span className="text-decoration-line-through text-muted ms-2">
                    ₹{singleProduct.product_price}
                  </span>
                  <span className="discount ms-2">
                    {(
                      ((singleProduct.product_price - singleProduct.product_discount_price) /
                        singleProduct.product_price) *
                      100
                    ).toFixed(0)}% OFF
                  </span>
                </div>
              )}

              {/* VARIATIONS */}
              {Object.entries(productVar).map(([key, values]) => (
                <div key={key} className="mb-3">
                  <label className="form-label fw-bold text-capitalize">Select {key}</label>
                  <div className="d-flex gap-2 mt-1 flex-wrap">
                    {values.map((option, idx) => (
                      <button
                        key={idx}
                        type="button"
                        className={`btn ${productVarSelected[key] === option ? "btn-danger" : "btn-outline-secondary"}`}
                        onClick={() => handleVariation(key, option)}
                        name={`variation[][${key}]`}
                      >
                        {option}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* HIDDEN VARIATION INPUTS */}
              {Object.entries(productVarSelected).map(([key, value]) => (
                <input key={key} type="hidden" name={`variation[][${key}]`} value={value} />
              ))}

              <div className="cate-text mt-3">
                <span className="text-success fw-bold">
                  <b className="text-dark">Availability:</b> In Stock
                </span>
              </div>

              <div className="cate-text mt-3">
                <span className="text-success fw-bold">
                  <b className="text-dark">Category:</b>{" "}
                  <Link className="fw-bold" to={`/category/${singleProduct.category.slug}`}>
                    {singleProduct.category.name}
                  </Link>
                </span>
              </div>

              <hr className="my-5" />

              {/* QUANTITY + CART BUTTONS */}
              <div className="purchase-btns mt-4 d-flex gap-3 align-items-center justify-content-between w-100">
                <div className="d-flex">
                  <button type="button" className="btn btn-outline-secondary" onClick={decreaseQuantity}>-</button>
                  <input type="number" className="form-control text-center mx-2" style={{ width: "50px" }} value={quantity} name="quantity" readOnly />
                  <button type="button" className="btn btn-outline-secondary" onClick={increaseQuantity}>+</button>
                </div>

                <button
                  type={addTocart.some((item) => item.prd_id === singleProduct.id) ? "button" : "submit"}
                  name="action_type"
                  value="add_to_cart"
                  onClick={() =>
                    addTocart.some((item) => item.prd_id === singleProduct.id)
                      ? toggleCart(singleProduct.id)
                      : null
                  }
                  className={`btn btn-success w-50 ${addTocart.some((item) => item.prd_id === singleProduct.id) ? "bg-dark" : ""}`}
                >
                  {addTocart.some((item) => item.prd_id === singleProduct.id)
                    ? "Remove from Cart"
                    : "Add to Cart"}
                  <FontAwesomeIcon icon={faCartShopping} className="ms-2" />
                </button>

                <button type="submit" name="action_type" value="buy_now" className="btn btn-outline-dark w-50">
                  BUY NOW
                </button>
              </div>

              {/* WISHLIST / SHARE */}
              <div className="mt-3 wishlist-sec-prodet d-flex align-items-center gap-3 justify-content-between">
                <div className="whiashad d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faHeart} />
                  <label>Add to Wishlist</label>
                </div>
                <div className="share-product d-flex align-items-center">
                  <p>Share product: </p>
                  <ul className="d-flex align-items-center gap-2 list-unstyled mb-0 ms-2">
                    <li><FontAwesomeIcon icon={faCopy} /></li>
                    <li><FontAwesomeIcon icon={faFacebook} /></li>
                    <li><FontAwesomeIcon icon={faXTwitter} /></li>
                    <li><FontAwesomeIcon icon={faPinterest} /></li>
                  </ul>
                </div>
              </div>

              {/* PAYMENT SECTION */}
              <div className="mt-3 Guarantee_Checkout border p-4 bg-light">
                <span>100% Guarantee Safe Checkout</span>
                <div className="paymetn-img mt-3">
                  <img src="/Payment Method.png" alt="Payment Options" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./Product_card.css";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faStar,
  faStarHalfAlt,
  faHeart as faSolidHeart,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { wishlistAction } from "../../../store/Products/wishlistSlice";
import { cartAction } from "../../../store/Products/cartSlice";
import { filtersAction } from "../../../store/Products/filtersSlice";

export default function Product_card({products,filters}) {
  const [all_products, setProducts] = useState([]);
  const dispatch = useDispatch();
  // console.log("asdlcnasldcnlasmdclml",products)

  useEffect(()=>{
    let sorted = [...products]
    switch (filters.sorted) {
      case "newest":
        sorted.sort((a, b) => b.id - a.id);
      break;
      case "a_to_z":
        sorted.sort((a, b) => a.product_name.localeCompare(b.product_name));
        break;
      case "z_to_a":
        sorted.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case "low_to_high":
        sorted.sort((a, b) => a.product_discount_price - b.product_discount_price);
        break;
      case "high_to_low":
        sorted.sort((a, b) => b.product_discount_price - a.product_discount_price);
        break;
      default:
        break;
    }
    sorted = sorted.filter(product => 
      product.product_discount_price >= filters.priceRangeMin && product.product_discount_price <= filters.priceRangeMax
  );
    setProducts(sorted)
  },[products,filters])

  useEffect(() => {
    if (products.length == 0) return;
    dispatch(filtersAction.countProduct(all_products.length));
  }, [all_products.length]);

  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);

  useEffect(() => {
    if (localStorage.getItem("wishlist")) {
      setWishlist([...JSON.parse(localStorage.getItem("wishlist"))]);
    }
    if (localStorage.getItem("cart")) {
      setaddTocart([...JSON.parse(localStorage.getItem("cart"))]);
    }
  }, []);

  const toggleWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    wishlist = wishlist.includes(id)
      ? wishlist.filter((num) => num !== id)
      : [id, ...wishlist];
    setWishlist(wishlist);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    dispatch(wishlistAction.addWishlist(wishlist.length));
  };

  const toggleCart = (id) => {
    let addTocart = JSON.parse(localStorage.getItem("cart")) || [];
  
    // Check if product is already in cart
    const isInCart = addTocart.some((item) => item.prd_id === id);
  
    if (isInCart) {
      // Remove from cart
      addTocart = addTocart.filter((item) => item.prd_id !== id);
      // console.log(addTocart)
      dispatch(cartAction.removeCart(addTocart));
    } else {
      const newItem = { quantity: 1, prd_id: id };
      console.log(newItem)
      addTocart = [newItem, ...addTocart];
      dispatch(cartAction.addCart(newItem)); // Dispatch add action
    }
  
    setaddTocart(addTocart);
  };


  return (
    <div className="row Product_card">
      {products.map((product, index) => (
        <div key={index} className="col-lg-3 col-md-6 col-sm-6 mb-3">
          <div className="feature-card">
            <span className="disco">{Math.round(((product.product_price - product.product_discount_price) / product.product_price) * 100)}%</span>
            <span
              className="wishicon"
              onClick={() => toggleWishlist(product.id)}
              style={{ cursor: "pointer", fontSize: "16px" }}
            >
              <FontAwesomeIcon
          icon={
            wishlist.includes(product.id) ? faSolidHeart : faRegularHeart
          }
          color={wishlist.includes(product.id) ? "red" : "black"}
        />
            </span>
            <Link to={`/product/${product.product_slug}`}>
              <div className="card-img">
              <img src={product.product_image} alt={product.product_name} />
              </div>
            </Link>
            <div className="product-detail">
              <h3>
              <Link to={`/product/${product.product_slug}`}>{product.product_name}</Link>
              </h3>
              <div className="rating d-flex align-items-center ">
                <FontAwesomeIcon key={0} icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfAlt} />
                <span>({product.avg_ratting})</span>
              </div>
              <div className="Pricing d-flex align-items-center">
                <p className="price">₹ {product.product_discount_price}</p>
                <p className="slashPrice">₹ {product.product_price}</p>
              </div>
            </div>
            <Link onClick={() => toggleCart(product.id)} className={`cart-btn ${addTocart.some(item => item.prd_id === product.id) ? "bg-dark" : ""}`}>
            {addTocart.some(item => item.prd_id === product.id) ? "Remove to Cart" : "Add to Cart"}
              <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

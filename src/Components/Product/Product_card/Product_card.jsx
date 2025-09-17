/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Product_card.css";
import { Link, useNavigate } from "react-router-dom";
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
import { AddOrDeleteWishlist, AddOrRemoveCart, API_URL, GetCartList } from "../../../Config/config";

export default function Product_card({ products, filters }) {
  const [all_products, setProducts] = useState([]);
  const dispatch = useDispatch();
  const [gettoken, setGettoken] = useState(null);
  const fetch_products = useSelector((store) => store.wishlist);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);
    if (localStorage.getItem("wishlist")) {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    }
  }, []);

  useEffect(() => {
    let sorted = [...products];
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
        sorted.sort(
          (a, b) => a.product_discount_price - b.product_discount_price
        );
        break;
      case "high_to_low":
        sorted.sort(
          (a, b) => b.product_discount_price - a.product_discount_price
        );
        break;
      default:
        break;
    }
    sorted = sorted.filter(
      (product) =>
        product.product_discount_price >= filters.priceRangeMin &&
        product.product_discount_price <= filters.priceRangeMax
    );
    setProducts(sorted);
  }, [products, filters]);

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

  // const toggleWishlist = (id) => {
  //   let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
  //   wishlist = wishlist.includes(id)
  //     ? wishlist.filter((num) => num !== id)
  //     : [id, ...wishlist];
  //   setWishlist(wishlist);
  //   localStorage.setItem("wishlist", JSON.stringify(wishlist));
  //   dispatch(wishlistAction.addWishlist(wishlist.length));
  // };

  const toggleCart = async (item) => {
    const token = localStorage.getItem("token");

    console?.log(
      "`${API_URL}${AddOrRemoveCart}`",
      `${API_URL}${AddOrRemoveCart}`
    );
    console?.log("item", item);
    try {
      const response = await fetch(`${API_URL}${AddOrRemoveCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item?.id }),
      });

      if (!response.ok) throw new Error("Failed to update cart.");

      const data = await response.json();
      console?.log("`${API_URL}${AddOrRemoveCart}`", data);

      if (data.message === "Product added to cart") {
        dispatch(cartAction.addCart(item)); // ✅ send single item
        setaddTocart((prev) => [item, ...prev]);
      } else if (data.message === "Product removed from cart") {
        dispatch(cartAction.removeCart(item)); // ✅ send single item
        setaddTocart((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Something went wrong while updating the cart.");
    }
  };

  const toggleWishlist = async (item) => {
    if (!gettoken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${AddOrDeleteWishlist}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gettoken}`,
        },
        body: JSON.stringify({ product_id: item?.id }),
      });

      if (!response.ok) throw new Error("Failed to update wishlist.");

      const data = await response.json();

      if (data.message.toLowerCase().includes("added")) {
        dispatch(
          wishlistAction.addToWishlist({ ...item, product_id: item.id })
        );
        setWishlist((prev) => {
          const updated = [...prev, item.id];
          localStorage.setItem("wishlist", JSON.stringify(updated));
          return updated;
        });
      } else if (data.message.toLowerCase().includes("removed")) {
        dispatch(wishlistAction.removeFromWishlist(item.id));
        setWishlist((prev) => {
          const updated = prev.filter((wid) => wid !== item.id);
          localStorage.setItem("wishlist", JSON.stringify(updated));
          return updated;
        });
      }
    } catch (error) {
      console.error("Wishlist update failed:", error);
      alert("Something went wrong while updating the wishlist.");
    }
  };

  return (
    <div className="row Product_card">
      {products.map((product, index) => (
        <div key={index} className="col-lg-3 col-md-6 col-sm-6 col-6 col-auto mb-3">
          <div className="feature-card">
            <span className="disco">
              {Math.round(
                ((product.product_price - product.product_discount_price) /
                  product.product_price) *
                  100
              )}
              %
            </span>
            {/* <span
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
            </span> */}
            <span
              className="wishicon"
              onClick={() => toggleWishlist(product)}
              style={{ cursor: "pointer", fontSize: "16px" }}
            >
              <FontAwesomeIcon
                icon={
                  fetch_products?.items?.some(
                    (wish) => wish.product_id === product?.id
                  )
                    ? faSolidHeart
                    : faRegularHeart
                }
                color={
                  fetch_products?.items?.some(
                    (wish) => wish.product_id === product?.id
                  )
                    ? "red"
                    : "black"
                }
              />
            </span>

            <Link to={`/product/${product.product_slug}`}>
              <div className="card-img">
                <img src={product.product_image} alt={product.product_name} />
              </div>
            </Link>
            <div className="product-detail">
              <h3>
                <Link to={`/product/${product.product_slug}`}>
                  {product.product_name}
                </Link>
              </h3>
              <div className="rating d-flex align-items-center ">
                <FontAwesomeIcon key={0} icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStar} />
                <FontAwesomeIcon icon={faStarHalfAlt} />
                <span>({product?.reviews?.length})</span>
              </div>
              <div className="Pricing d-flex align-items-center">
                <p className="price">₹ {product.product_discount_price}</p>
                <p className="slashPrice">₹ {product.product_price}</p>
              </div>
            </div>
            <Link
              onClick={() => toggleCart(product)}
              className={`cart-btn ${
                addTocart.some((item) => item?.id === product?.id)
                  ? "bg-dark"
                  : ""
              }`}
            >
              {addTocart.some((item) => item?.id === product?.id)
                ? "Remove to Cart"
                : "Add to Cart"}
              <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}

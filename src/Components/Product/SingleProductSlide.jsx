/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { cartAction } from "../../store/Products/cartSlice";
import { AddOrRemoveCart, API_URL, GetCartList } from "../../Config/config";

export default function SingleProductSlide({ product }) {
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const [gettoken, setGettoken] = useState(null);

  const addToCart = useSelector((store) => store.cart);

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);
  }, []);

  useEffect(() => {
    if (localStorage.getItem("wishlist")) {
      setWishlist([...JSON.parse(localStorage.getItem("wishlist"))]);
    }
    if (localStorage.getItem("cart")) {
      setaddTocart([...JSON.parse(localStorage.getItem("cart"))]);
    }
  }, []);

  const toggleCart = async (item) => {
    try {
      const response = await fetch(`${API_URL}${AddOrRemoveCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gettoken}`,
        },
        body: JSON.stringify({ product_id: item?.id }),
      });

      if (!response.ok) throw new Error("Failed to update cart.");

      const data = await response.json();

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

  return (
    <div key={product.id} className="feature-card">
      <span className="disco">
        {Math.round(
          ((product?.product_price - product?.product_discount_price) /
            product?.product_price) *
            100
        )}
        %
      </span>
      {/* <span
        className="wishicon"
        onClick={() => toggleWishlist(product.prd_id)}
        style={{ cursor: "pointer", fontSize: "16px" }}
      >
        <FontAwesomeIcon
          icon={
            wishlist.includes(product.prd_id) ? faSolidHeart : faRegularHeart
          }
          color={wishlist.includes(product.prd_id) ? "red" : "black"}
        />
      </span> */}
      {/* <Link to={`/product/${product.product_slug}`}> */}
        <div className="card-img">
          <img src={product.product_image} alt={product.product_name} />
        </div>
      {/* </Link> */}
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
          <span>({product.avg_ratting})</span>
        </div>
        <div className="Pricing d-flex align-items-center ">
          <p className="price">₹ {product.product_discount_price} </p>
          <p className="slashPrice">₹ {product.product_price} </p>
        </div>
      </div>
      <a
        onClick={() => toggleCart(product)}
        className={`cart-btn ${
          addTocart.some((item) => item?.id === product?.id) ? "bg-dark" : ""
        }`}
      >
        {addTocart.some((item) => item?.id === product?.id)
          ? "Remove to Cart"
          : "Add to Cart"}
        <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
      </a>
    </div>
  );
}

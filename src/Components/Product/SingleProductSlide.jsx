import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import { cartAction } from "../../store/Products/cartSlice";
import {
  AddOrDeleteWishlist,
  AddOrRemoveCart,
  API_URL,
} from "../../Config/config";

import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

export default function SingleProductSlide({ product }) {
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const [gettoken, setGettoken] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

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
    // ✅ Check if user is logged in
    if (!gettoken) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${AddOrRemoveCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gettoken}`,
        },
        body: JSON.stringify({ product_id: item?.id, quantity: "" }),
      });

      if (!response.ok) throw new Error("Failed to update cart.");

      const data = await response.json();

      if (data.message === "Product added to cart") {
        dispatch(cartAction.addCart(item));
        setaddTocart((prev) => [item, ...prev]);
      } else if (data.message === "Product removed from cart") {
        dispatch(cartAction.removeCart(item));
        setaddTocart((prev) => prev.filter((i) => i?.id !== item?.id));
      } else {
        console?.log("AddOrRemoveCart ---->>", data);
      }
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Something went wrong while updating the cart.");
    }
  };

  const toggleWishlist = async (item) => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${AddOrDeleteWishlist}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: item?.id }),
      });

      if (!response.ok) throw new Error("Failed to update wishlist.");

      const data = await response.json();
      console.log("Wishlist API response:", data);

      const id = item.id;

      if (data.message.toLowerCase().includes("added")) {
        dispatch(wishlistAction.addToWishlist({ ...item, product_id: id }));
        setWishlist((prev) => {
          const updated = [...prev, id];
          localStorage.setItem("wishlist", JSON.stringify(updated));
          return updated;
        });
      } else if (data.message.toLowerCase().includes("removed")) {
        dispatch(wishlistAction.removeFromWishlist(id));
        setWishlist((prev) => {
          const updated = prev.filter((wid) => wid !== id);
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
    <div key={product?.id} className="feature-card">
      <span className="disco">
        {Math.round(
          ((product?.product_price - product?.product_discount_price) /
            product?.product_price) *
            100
        )}
        %
      </span>
      <span
        className="wishicon"
        onClick={() => toggleWishlist(product)}
        style={{ cursor: "pointer", fontSize: "16px" }}
      >
        <FontAwesomeIcon
          icon={wishlist.includes(product?.id) ? faSolidHeart : faRegularHeart}
          color={wishlist.includes(product?.id) ? "red" : "black"}
        />
      </span>

      <div className="card-img">
        <img src={product?.product_image} alt={product?.product_name} />
      </div>

      <div className="product-detail">
        <h3>
          <Link to={`/product/${product?.product_slug}`}>
            {product?.product_name}
          </Link>
        </h3>
        <div className="rating d-flex align-items-center ">
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStar} />
          <FontAwesomeIcon icon={faStarHalfAlt} />
          <span>({product?.reviews?.length})</span>
        </div>
        <div className="Pricing d-flex align-items-center ">
          <p className="price">₹ {product?.product_discount_price}</p>
          <p className="slashPrice">₹ {product?.product_price} </p>
        </div>
      </div>

      <a
        onClick={() => toggleCart(product)}
        className={`cart-btn ${
          addTocart.some((item) => item?.id === product?.id) ? "bg-dark" : ""
        }`}
      >
        {addTocart.some((item) => item?.id === product?.id)
          ? "Remove from Cart"
          : "Add to Cart"}
        <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
      </a>
    </div>
  );
}

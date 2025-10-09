import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faStar as faSolidStar,
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

import { faEye, faHeart as faRegularHeart , faStar as faRegularStar} from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

export default function SingleProductSlide({ product }) {
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const [gettoken, setGettoken] = useState(null);
  const fetch_products = useSelector((store) => store.wishlist);
  // console.log(product)

  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);
  }, []);

  // console.log("product recently viewed" ,product)
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
      // console.log("Wishlist API response:", data);

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

  const isInWishlist = fetch_products?.items?.some(
    (wish) => wish.product_id === product?.id
  );

  return (
    <div key={product?.id} className="feature-card">
      <span className="disco">{product?.percent_off}%</span>
      {/* <span
        className="wishicon"
        onClick={() => toggleWishlist(product)}
        style={{ cursor: "pointer", fontSize: "16px" }}
      >
        <FontAwesomeIcon
          icon={wishlist.includes(product?.id) ? faSolidHeart : faRegularHeart}
          color={wishlist.includes(product?.id) ? "red" : "black"}
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

      <div className="card-img">
        <img src={product?.product_image} alt={product?.product_name} />
      </div>

      <div className="product-detail">
        <h3>
          <Link to={`/product/${product?.product_slug}`}>
            {product?.product_name}
          </Link>
        </h3>
        <div className="rating d-flex align-items-center">
  {(() => {
    const avg = parseFloat(product?.reviews_avg_star) || 0;
    // round to nearest 0.5 for nicer UX (4.4 -> 4.5, 4.24 -> 4.0, etc.)
    const rounded = Math.round(avg * 2) / 2;
    const fullStars = Math.floor(rounded);
    const hasHalf = rounded - fullStars === 0.5;

    return Array.from({ length: 5 }, (_, i) => {
      if (i < fullStars) {
        return <FontAwesomeIcon key={i} icon={faSolidStar} />;
      }
      if (i === fullStars && hasHalf) {
        return <FontAwesomeIcon key={i} icon={faStarHalfAlt} />;
      }
      return <FontAwesomeIcon key={i} icon={faRegularStar} />;
    });
  })()}
  <span className="ms-1">({product?.reviews?.length || 0})</span>
</div>

        <div className="Pricing d-flex align-items-center ">
          <p className="price">₹ {product?.product_discount_price}</p>
          <p className="slashPrice">₹ {product?.product_price} </p>
        </div>
      </div>

              {product?.customization === 0 ? (
                    <Link
                      onClick={() => toggleCart(product)}
                      className={`cart-btn ${
                        addTocart.some((item) => item?.id === product?.id) ? "bg-dark" : ""
                      }`}
                    >
                      {addTocart.some((item) => item?.id === product?.id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                      <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
                    </Link>
                    ) : (
                <Link to={`/product/${product.product_slug}`} className="cart-btn border-0">
                  View Product <FontAwesomeIcon icon={faEye} />
                </Link>
              )}
    </div>
  );
}

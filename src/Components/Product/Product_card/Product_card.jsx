import React, { useEffect, useState } from "react";
import "./Product_card.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBagShopping, faStar as faSolidStar, faStarHalfAlt, faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart, faStar as faRegularStar } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import { wishlistAction } from "../../../store/Products/wishlistSlice";
import { cartAction } from "../../../store/Products/cartSlice";
import { AddOrDeleteWishlist, AddOrRemoveCart, API_URL } from "../../../Config/config";

export default function Product_card({ products }) {
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setAddToCart] = useState([]);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const fetch_products = useSelector((store) => store.wishlist);
  const [gettoken, setGetToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGetToken(token);
    if (localStorage.getItem("wishlist")) {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    }
    if (localStorage.getItem("cart")) {
      setAddToCart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  const toggleCart = async (item) => {
    const token = localStorage.getItem("token");
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

      if (data.message === "Product added to cart") {
        dispatch(cartAction.addCart(item));
        setAddToCart((prev) => [item, ...prev]);
      } else if (data.message === "Product removed from cart") {
        dispatch(cartAction.removeCart(item));
        setAddToCart((prev) => prev.filter((i) => i.id !== item.id));
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
        dispatch(wishlistAction.addToWishlist({ ...item, product_id: item.id }));
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

  if (!products?.status || products.data.length === 0) return <div>No products found.</div>;

  return (
    <div className="row Product_card">
      {products.data.map((product) => {
        let price = product.product_discount_price || product.product_price;
        let image = product.product_image;

        // Handle variations if main price is missing
        if (!price && product.variations?.variation_json) {
          try {
            const variationArr = JSON.parse(product.variations.variation_json);
            const firstVar = variationArr[0];
            price = firstVar.sale_price || firstVar.reguler_price;
            image = `${API_URL}/uploads/${firstVar.image}`;
          } catch (err) {
            console.warn(err);
          }
        }

        return (
          <div key={product.id} className="col-lg-3 col-md-6 col-sm-6 col-6 col-auto mb-3">
            <div className="feature-card">
              {product.percent_off && <span className="disco">{product.percent_off}%</span>}

              <span
                className="wishicon"
                onClick={() => toggleWishlist(product)}
                style={{ cursor: "pointer", fontSize: "16px" }}
              >
                <FontAwesomeIcon
                  icon={fetch_products?.items?.some((wish) => wish.product_id === product?.id) ? faSolidHeart : faRegularHeart}
                  color={fetch_products?.items?.some((wish) => wish.product_id === product?.id) ? "red" : "black"}
                />
              </span>

              <Link to={`/product/${product.product_slug}`}>
                <div className="card-img">
                  <img src={image} alt={product.product_name} />
                </div>
              </Link>

              <div className="product-detail">
                <h3>
                  <Link to={`/product/${product.product_slug}`}>{product.product_name}</Link>
                </h3>

                <div className="rating d-flex align-items-center">
                  {(() => {
                    const avg = parseFloat(product?.reviews_avg_star) || 0;
                    const rounded = Math.round(avg * 2) / 2;
                    const fullStars = Math.floor(rounded);
                    const hasHalf = rounded - fullStars === 0.5;

                    return Array.from({ length: 5 }, (_, i) => {
                      if (i < fullStars) return <FontAwesomeIcon key={i} icon={faSolidStar} />;
                      if (i === fullStars && hasHalf) return <FontAwesomeIcon key={i} icon={faStarHalfAlt} />;
                      return <FontAwesomeIcon key={i} icon={faRegularStar} />;
                    });
                  })()}
                  <span className="ms-1">({product?.reviews?.length || 0})</span>
                </div>

                <div className="Pricing d-flex align-items-center">
                  <p className="price">₹ {product.product_discount_price || price}</p>
                  {product.product_discount_price && (
                    <p className="slashPrice">₹ {product.product_price || price}</p>
                  )}
                </div>
              </div>

              <button
                onClick={() => toggleCart(product)}
                className={`cart-btn border-0 ${addTocart.some((item) => item?.id === product?.id) ? "bg-dark " : ""}`}
              >
                {addTocart.some((item) => item?.id === product?.id) ? "Remove from Cart" : "Add to Cart"}
                <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
 
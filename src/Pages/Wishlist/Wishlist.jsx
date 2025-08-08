import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faHouse,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import ScrollToTop from "../ScrollToTop";
import config from '../../Config/config.json';

export default function Wishlist() {
  const AuthCheck = useSelector((store) => store.authcheck);
  const fetch_products = useSelector((store) => store.products);
  const [wishlistIds, setWishlistIds] = useState([]);
  const [products, setProducts] = useState([]);

  const dispatch = useDispatch();

  // Fetch wishlist product IDs from API
  const fetchWishlistFromAPI = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        // "https://dimgrey-eel-688395.hostingersite.com/api/bag/get-wishlist",
          `${config.API_URL}/bag/get-wishlist`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.data) {
        const productIds = response.data.data.map((item) => item.product_id);
        setWishlistIds(productIds);
        dispatch(wishlistAction.addWishlist(productIds.length));
      }
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    }
  };

  useEffect(() => {
    fetchWishlistFromAPI();
  }, []);

  useEffect(() => {
    if (fetch_products.status && wishlistIds.length > 0) {
      const idsSet = new Set(wishlistIds);
      const filteredProducts = fetch_products.data.filter((product) =>
        idsSet.has(product.id)
      );
      setProducts(filteredProducts);
    } else if (wishlistIds.length === 0) {
      setProducts([]);
    }
  }, [fetch_products.status, wishlistIds]);

  // Remove product from wishlist
  const removeWishlist = async (product_id) => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${config.API_URL}/bag/add-remove-wishlist`,
        { product_id },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data?.success) {
        await fetchWishlistFromAPI();
      }
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Header />
      <div className="breadcrum_box mt-2">
        <nav aria-label="breadcrumb">
          <div className="container">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/home" className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={faHouse}
                    style={{ fontSize: "14px", marginTop: "-4px" }}
                  />
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Wishlists
              </li>
            </ol>
          </div>
        </nav>
      </div>

      <div className="wishlist-box my-5">
        {AuthCheck.status && (
          <div className="container">
            <div className="cart-title d-flex align-items-center justify-content-center mb-5">
              <h2>
                Product <span> Wishlist</span>
              </h2>
            </div>
            <div className="wishlistTitle_btn d-flex justify-content-between mb-3">
              <h3 className="uppercase">Wishlist</h3>
              <Link to="/product">Shop Now</Link>
            </div>
            <div className="row Product_card">
              {products.length === 0 ? (
                <div className="text-center w-100 py-5">
                  <h5>No products in your wishlist.</h5>
                </div>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className="col-lg-3 col-md-6 col-sm-6 mb-3"
                  >
                    <div className="feature-card">
                      <span className="disco">
                        {Math.round(
                          ((product.product_price -
                            product.product_discount_price) /
                            product.product_price) *
                            100
                        )}
                        %
                      </span>
                      <span
                        className="wishicon"
                        onClick={() => removeWishlist(product.id)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                      <Link to={product.link || `/product/${product.product_slug}`}>
                        <div className="card-img">
                          <img
                            src={product.product_image}
                            alt={product.product_name}
                          />
                        </div>
                      </Link>
                      <div className="product-detail">
                        <h3>
                          <Link to={`/product/${product.product_slug}`}>
                            {product.product_name}
                          </Link>
                        </h3>
                        <div className="rating d-flex align-items-center">
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStarHalfAlt} />
                          <span>({product.avg_ratting})</span>
                        </div>
                        <div className="Pricing d-flex align-items-center">
                          <p className="price">
                            ₹ {product.product_discount_price}
                          </p>
                          <p className="slashPrice">
                            ₹ {product.product_price}
                          </p>
                        </div>
                        <a href="/cart" className="cart-btn">
                          Add to Cart{" "}
                          <FontAwesomeIcon icon={faBagShopping} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </>
  );
}

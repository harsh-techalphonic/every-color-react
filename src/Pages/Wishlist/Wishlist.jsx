/* eslint-disable react-hooks/exhaustive-deps */
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
import ProductsApi from "../../API/ProductsApi";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import ScrollToTop from "../ScrollToTop";
import { fetchWishListApi } from "../../API/AllApiCode";

export default function Wishlist() {
  const AuthCheck = useSelector((store) => store.authcheck);
  const fetch_products = useSelector((store) => store.products);
  const [products, setProducts] = useState([]);
  console?.log("products ----->>>>", products);
  const dispatch = useDispatch();
  // useEffect(() => {
  //   if (fetch_products.status && localStorage.getItem("wishlist")) {
  //     const wishlistIds = new Set(JSON.parse(localStorage.getItem("wishlist"))); // Use Set for faster lookup
  //     setProducts(
  //       fetch_products.data.filter((product) => wishlistIds.has(product.prd_id))
  //     ); // Use `.has()` for O(1) lookup
  //   }
  // }, [fetch_products.status]);

  // const removeWishlist = (id) => {
  //   let wishlist = JSON.parse(localStorage.getItem("wishlist"));
  //   wishlist = wishlist.filter((num) => num !== id);
  //   localStorage.setItem("wishlist", JSON.stringify(wishlist));
  //   dispatch(wishlistAction.addWishlist(wishlist.length));
  //   setProducts(products.filter((product) => product.prd_id !== id));
  // };

  useEffect(() => {
    const getWishlist = async () => {
      if (!AuthCheck.status) return; // only fetch if logged in

      try {
        const wishlistResponse = await fetchWishListApi();

        if (wishlistResponse?.status && wishlistResponse?.data?.length > 0) {
          // If API returns product IDs and you already have product data in Redux

          // If API returns full product objects
          if (wishlistResponse.data) {
            setProducts(wishlistResponse.data);
            // console?.log('wishlistResponse.data' ,wishlistResponse.data?)
          }
        } else {
          setProducts([]); // no products
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };

    getWishlist();
  }, [AuthCheck.status]);

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
                  />{" "}
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
        {AuthCheck.status ? (
          <>
            <div className="container">
              <div className="cart-title d-flex align-items-center justify-content-center mb-5">
                <h2>
                  Product <span> Wishlist</span>
                </h2>
                <ProductsApi />
              </div>
              <div className="wishlistTitle_btn d-flex justify-content-between mb-3">
                <h3 className="uppercase">Wishlist</h3>
                <Link to="/product">Shop Now</Link>
              </div>

              {/* wishlist api data  */}
              <div className="row Product_card">
                {products.map((product) => (
                  <div
                    key={product.prd_id}
                    className="col-lg-3 col-md-6 col-sm-6 mb-3"
                  >
                    <div className="feature-card">
                      <span className="disco">
                        {Math.round(
                          ((product?.product?.product_price -
                            product?.product?.discount_price) /
                            product?.product?.product_price) *
                            100
                        )}
                        %
                      </span>
                      <span
                        className="wishicon"
                        // onClick={() => removeWishlist(product.prd_id)}
                        style={{ cursor: "pointer" }}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>
                      <Link to={product.link}>
                        <div className="card-img">
                          <img
                            src={product?.product?.product_image}
                            alt={product.title}
                          />
                        </div>
                      </Link>
                      <div className="product-detail">
                        <h3>
                          <Link to={`/product/${product.slug}`}>
                            {product?.product?.product_name}
                          </Link>
                        </h3>
                        <div className="rating d-flex align-items-center ">
                          <FontAwesomeIcon key={0} icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStar} />
                          <FontAwesomeIcon icon={faStarHalfAlt} />
                          <span>({product.avg_ratting})</span>
                        </div>
                        <div className="Pricing d-flex align-items-center">
                          <p className="price">
                            ₹ {product?.product?.product_discount_price}{" "}
                          </p>
                          <p className="slashPrice">
                            ₹ {product?.product?.product_price}{" "}
                          </p>
                        </div>
                        <a href="/cart" className="cart-btn">
                          Add to Cart <FontAwesomeIcon icon={faBagShopping} />
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          ""
        )}
      </div>
      <Footer />
    </>
  );
}

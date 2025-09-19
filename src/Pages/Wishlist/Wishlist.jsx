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
import { deleteCartItem, fetchWishListApi } from "../../API/AllApiCode";
import { DeleteWishList } from "../../Config/config";

export default function Wishlist() {
  const AuthCheck = useSelector((store) => store.authcheck);
  // const fetch_products = useSelector((store) => store.wishlist);
  // console?.log("Wishlist _------<>>>>", fetch_products);
  const [products, setProducts] = useState([]);
  console.log("products from wishlist", products)
  const dispatch = useDispatch();

  useEffect(() => {
    getWishlist();
  }, [AuthCheck.status]);

  const getWishlist = async () => {
    if (!AuthCheck.status) return;

    try {
      const wishlistResponse = await fetchWishListApi();

      if (wishlistResponse?.status && wishlistResponse?.data?.length > 0) {
        setProducts(wishlistResponse.data);
        dispatch(wishlistAction.setWishlist(wishlistResponse.data));
      } else {
        setProducts([]);
        dispatch(wishlistAction.setWishlist([]));
      }
    } catch (err) {
      console.error("Error loading wishlist:", err);
    }
  };

  // const handleRemove = (id) => {
  //   // 1️⃣ Remove from UI
  //   setProducts((prev) => prev.filter((item) => item.id !== id));

  //   // 2️⃣ Remove from Redux
  //   dispatch(wishlistAction.removeWishlistItem(id));
  // };

  const handleRemove = async (item) => {
    console?.log('item ------->>>>>',item)
    const confirmDelete = window.confirm(
      `Are you sure you want to remove product from your cart?`
    );

    if (!confirmDelete) return; // User cancelled

    try {
      const success = await deleteCartItem(item, DeleteWishList);
      if (success) {
        getWishlist();
        setProducts((prev) => prev.filter((p) => p?.id !== item?.id));
        dispatch(wishlistAction.removeWishlistItem(item));

        console.log("Item removed successfully!");
      } 
    } catch (error) {
      console.error("Error deleting item:", error);
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
                {products?.map((product) => (
                  <div
                    key={product?.id}
                    className="col-lg-3 col-md-6 col-sm-6 mb-3"
                  >
                    <div className="feature-card">
                      <span className="disco">
                        {Math.round(
                          ((product?.product?.product_price -
                            product?.product?.product_discount_price) /
                            product?.product?.product_price) *
                            100
                        )}
                        %
                      </span>
                      <span
                        className="wishicon"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemove(product?.id)}
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

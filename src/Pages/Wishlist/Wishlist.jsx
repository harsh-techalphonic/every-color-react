// /* eslint-disable react-hooks/exhaustive-deps */
// import React, { useEffect, useState } from "react";
// import "./Wishlist.css";
// import Header from "../../Components/Partials/Header/Header";
// import Footer from "../../Components/Partials/Footer/Footer";
// import { Link } from "react-router-dom";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import {
//   faBagShopping,
//   faHouse,
//   faStar,
//   faStarHalfAlt,
// } from "@fortawesome/free-solid-svg-icons";
// import { faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
// import { useDispatch, useSelector } from "react-redux";
// import ProductsApi from "../../API/ProductsApi";
// import { wishlistAction } from "../../store/Products/wishlistSlice";
// import ScrollToTop from "../ScrollToTop";
// import { deleteCartItem, fetchWishListApi } from "../../API/AllApiCode";
// import { DeleteWishList } from "../../Config/config";

// export default function Wishlist() {
//   const AuthCheck = useSelector((store) => store.authcheck);
//   const [products, setProducts] = useState([]);
//   console.log("products from wishlist", products);
//   const dispatch = useDispatch();

//   useEffect(() => {
//     getWishlist();
//   }, [AuthCheck.status]);

//   const getWishlist = async () => {
//     if (!AuthCheck.status) return;

//     try {
//       const wishlistResponse = await fetchWishListApi();

//       if (wishlistResponse?.status && wishlistResponse?.data?.length > 0) {
//         setProducts(wishlistResponse.data);
//         dispatch(wishlistAction.setWishlist(wishlistResponse.data));
//       } else {
//         setProducts([]);
//         dispatch(wishlistAction.setWishlist([]));
//       }
//     } catch (err) {
//       console.error("Error loading wishlist:", err);
//     }
//   };

//   const handleRemove = async (item) => {
//     const confirmDelete = window.confirm(
//       `Are you sure you want to remove product from your cart?`
//     );

//     if (!confirmDelete) return; // User cancelled

//     try {
//       const success = await deleteCartItem(item, DeleteWishList);
//       if (success) {
//         getWishlist();
//         setProducts((prev) => prev.filter((p) => p?.id !== item?.id));
//         dispatch(wishlistAction.removeWishlistItem(item));

//         // console.log("Item removed successfully!");
//       }
//     } catch (error) {
//       console.error("Error deleting item:", error);
//     }
//   };

//   return (
//     <>
//       <ScrollToTop />
//       <Header />
//       <div className="breadcrum_box mt-2">
//         <nav aria-label="breadcrumb">
//           <div className="container">
//             <ol className="breadcrumb mb-0">
//               <li className="breadcrumb-item">
//                 <Link to="" className="d-flex align-items-center gap-2">
//                   <FontAwesomeIcon
//                     icon={faHouse}
//                     style={{ fontSize: "14px", marginTop: "-4px" }}
//                   />{" "}
//                   Home
//                 </Link>
//               </li>
//               <li className="breadcrumb-item active" aria-current="page">
//                 Wishlists
//               </li>
//             </ol>
//           </div>
//         </nav>
//       </div>
//       <div className="wishlist-box my-5">
//         {AuthCheck.status ? (
//           <>
//             <div className="container">
//               <div className="cart-title d-flex align-items-center justify-content-center mb-5">
//                 <h2>
//                   Product <span> Wishlist</span>
//                 </h2>
//                 <ProductsApi />
//               </div>
//               <div className="wishlistTitle_btn d-flex justify-content-between mb-3">
//                 <h3 className="uppercase">Wishlist</h3>
//                 <Link to="/product">Shop Now</Link>
//               </div>

//               {/* wishlist api data  */}
//               <div className="row Product_card">
//                 {products?.map((product) => (
//                   <div
//                     key={product?.id}
//                     className="col-lg-3 col-md-6 col-sm-6 mb-3"
//                   >
//                     <div className="feature-card">
//                       <span className="disco">
//                         {product?.product?.percent_off} %
//                       </span>

//                       <span
//                         className="wishicon"
//                         style={{ cursor: "pointer" }}
//                         onClick={() => handleRemove(product?.id)}
//                       >
//                         <FontAwesomeIcon icon={faTrashAlt} />
//                       </span>
//                       {/* {console.log("prodyct wishlist", product)} */}
//                       <Link to={`/product/${product?.product?.product_slug}`}>
//                         <div className="card-img">
//                           <img
//                             src={product?.product?.product_image}
//                             alt={product.title}
//                           />
//                         </div>
//                       </Link>
//                       <div className="product-detail">
//                         <h3>
//                           <Link
//                             to={`/product/${product?.product?.product_slug}`}
//                           >
//                             {product?.product?.product_name}
//                           </Link>
//                         </h3>
//                         <div className="rating d-flex align-items-center ">
//                           <FontAwesomeIcon key={0} icon={faStar} />
//                           <FontAwesomeIcon icon={faStar} />
//                           <FontAwesomeIcon icon={faStar} />
//                           <FontAwesomeIcon icon={faStarHalfAlt} />
//                           <span>({product.avg_ratting})</span>
//                         </div>
//                         <div className="Pricing d-flex align-items-center">
//                           <p className="price">
//                             ₹ {product?.product?.product_discount_price}{" "}
//                           </p>
//                           <p className="slashPrice">
//                             ₹ {product?.product?.product_price}{" "}
//                           </p>
//                         </div>
//                         {product?.product?.customization === 0 ? (
//                           <Link to="/cart" className="cart-btn">
//                             Add to Cart <FontAwesomeIcon icon={faBagShopping} />
//                           </Link>
//                         ) : (
//                           <Link
//                             to={`/product/${product?.product?.product_slug}`}
//                             className="cart-btn border-0"
//                           >
//                             View Product <FontAwesomeIcon icon={faEye} />
//                           </Link>
//                         )}
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           </>
//         ) : (
//           ""
//         )}
//       </div>
//       <Footer />
//     </>
//   );
// }

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "./Wishlist.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBagShopping,
  faHouse,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faEye, faTrashAlt } from "@fortawesome/free-regular-svg-icons";
import { useDispatch, useSelector } from "react-redux";
import ProductsApi from "../../API/ProductsApi";
import { wishlistAction } from "../../store/Products/wishlistSlice";
import { cartAction } from "../../store/Products/cartSlice"; // Import cart actions
import ScrollToTop from "../ScrollToTop";
import { deleteCartItem, fetchWishListApi } from "../../API/AllApiCode";
import { DeleteWishList, AddOrRemoveCart, API_URL } from "../../Config/config";

export default function Wishlist({ onHeaderHeight }) {
  const AuthCheck = useSelector((store) => store.authcheck);
  const [products, setProducts] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const [gettoken, setGettoken] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("products from wishlist", products);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);

    if (localStorage.getItem("cart")) {
      setaddTocart([...JSON.parse(localStorage.getItem("cart"))]);
    }
  }, []);

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

  // Add this cart toggle function (same as in SingleProductSlide)
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

  const handleRemove = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove product from your wishlist?`
    );

    if (!confirmDelete) return; // User cancelled

    try {
      const success = await deleteCartItem(item, DeleteWishList);
      if (success) {
        getWishlist();
        setProducts((prev) => prev.filter((p) => p?.id !== item?.id));
        dispatch(wishlistAction.removeWishlistItem(item));
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Header onHeight={onHeaderHeight} />
      <div className="breadcrum_box mt-2">
        <nav aria-label="breadcrumb">
          <div className="container">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/" className="d-flex align-items-center gap-2">
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
                        {product?.product?.percent_off} %
                      </span>

                      <span
                        className="wishicon"
                        style={{ cursor: "pointer" }}
                        onClick={() => handleRemove(product?.id)}
                      >
                        <FontAwesomeIcon icon={faTrashAlt} />
                      </span>

                      <Link to={`/product/${product?.product?.product_slug}`}>
                        <div className="card-img">
                          <img
                            src={product?.product?.product_image}
                            alt={product.title}
                          />
                        </div>
                      </Link>

                      <div className="product-detail">
                        <h3>
                          <Link
                            to={`/product/${product?.product?.product_slug}`}
                          >
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

                        {/* Updated cart button with same functionality */}
                        {product?.product?.customization === 0 ? (
                          <Link
                            onClick={() => toggleCart(product?.product)}
                            className={`cart-btn ${
                              addTocart.some(
                                (item) => item?.id === product?.product?.id
                              )
                                ? "bg-dark"
                                : ""
                            }`}
                          >
                            {addTocart.some(
                              (item) => item?.id === product?.product?.id
                            )
                              ? "Remove from Cart"
                              : "Add to Cart"}
                            <FontAwesomeIcon
                              icon={faBagShopping}
                              className="ms-2"
                            />
                          </Link>
                        ) : (
                          <Link
                            to={`/product/${product?.product?.product_slug}`}
                            className="cart-btn border-0"
                          >
                            View Product <FontAwesomeIcon icon={faEye} />
                          </Link>
                        )}
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

"use client";

import { useEffect, useState } from "react";
import Slider from "react-slick";
import "./ProductDetail.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCartShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faCopy } from "@fortawesome/free-regular-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import { faFacebook, faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { Link, useNavigate, useParams } from "react-router-dom";
import { cartAction } from "../../store/Products/cartSlice";
import { useDispatch, useSelector } from "react-redux";
import {
  AddOrDeleteWishlist,
  AddOrRemoveCart,
  API_URL,
  ImageUrl,
} from "../../Config/config";

import { wishlistAction } from "../../store/Products/wishlistSlice";

import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";

// MAIN COMPONENT
export default function Product_detail({ singleProduct }) {
  const [quantity, setQuantity] = useState(1);
  const [productVar, setProductVar] = useState({});
  const [productVarSelected, setProductVarSelected] = useState({});
  const [productAmount, setProductAmount] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [addTocart, setaddTocart] = useState([]);
  const dispatch = useDispatch();
  const [mainSlider, setMainSlider] = useState(null);
  const [navSlider, setNavSlider] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetch_products = useSelector((store) => store.wishlist);
  const [gettoken, setGettoken] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);

  console.log("console signle product data", singleProduct);

  // IMAGE URL FUNCTION
  const getVariationImage = (filename) => `${ImageUrl}${filename}`;
  const navigate = useNavigate();

  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;

    setZoomStyle({
      transformOrigin: `${x}% ${y}%`,
      transform: "scale(2)",
    });
  };

  const handleMouseEnter = () => {
    setIsZooming(true);
  };

  const handleMouseLeave = () => {
    setIsZooming(false);
    setZoomStyle({});
  };

  const handleBuyNow = () => {
    // build the product payload
    if (!gettoken) {
      navigate("/login");
      return;
    }

    const buyProduct = {
      id: singleProduct.id,
      product_name: singleProduct.product_name,
      customization: singleProduct.customization,
      product_image: singleProduct.galleries?.[0]?.image || "",
      price: productAmount
        ? productAmount.reguler_price
        : singleProduct.product_price,
      discount_price: productAmount
        ? productAmount.sale_price
        : singleProduct.product_discount_price,
      quantity,
      tax: singleProduct.gst_rate,
      cod: singleProduct.cod,
      variation:
        Object.keys(productVarSelected).length > 0 ? productVarSelected : null,
    };

    // navigate to checkout with this single product
    navigate("/checkout", { state: { product: buyProduct, quantity } });
  };

  // SHARE HANDLERS
  const { slug } = useParams();
  const productUrl = `${window.location.origin}/product/${slug}`;

  const handleCopyLink = () => {
    if (navigator.clipboard && window.isSecureContext) {
      // Modern secure way
      navigator.clipboard
        .writeText(productUrl)
        .then(() => toast.success("Product link copied to clipboard!"))
        .catch(() => toast.error("Failed to copy link."));
    } else {
      // Fallback for insecure context or unsupported browsers
      const textArea = document.createElement("textarea");
      textArea.value = productUrl;
      textArea.style.position = "fixed"; // avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        document.execCommand("copy");
        toast.success("Product link copied to clipboard!");
      } catch (err) {
        toast.error("Failed to copy link.");
      }
      document.body.removeChild(textArea);
    }
  };

  const handleShare = (platform) => {
    let shareUrl = "";

    switch (platform) {
      case "facebook":
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          productUrl
        )}`;
        break;
      // case "twitter":
      //   shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(productUrl)}&text=Check out this product!`;
      //   break;
      case "whatsapp":
        shareUrl = `https://api.whatsapp.com/send?text=Check out this product: ${encodeURIComponent(
          productUrl
        )}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, "_blank", "noopener,noreferrer");
  };

  const increaseQuantity = () => setQuantity((q) => q + 1);
  const decreaseQuantity = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  // Load wishlist & cart from localStorage (once)
  useEffect(() => {
    if (localStorage.getItem("wishlist")) {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    }
    if (localStorage.getItem("cart")) {
      setaddTocart(JSON.parse(localStorage.getItem("cart")));
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);

    if (localStorage.getItem("wishlist")) {
      setWishlist(JSON.parse(localStorage.getItem("wishlist")));
    }
  }, []);

  // Build available variation attributes whenever the product changes
  useEffect(() => {
    // reset selection & price and quantity for new product
    setProductVarSelected({});
    setProductAmount(false);
    setQuantity(1);

    if (!singleProduct?.variations?.variation_json) {
      setProductVar({});
      return;
    }

    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      setProductVar({});
      return;
    }

    const removeKeys = ["sale_price", "stock_status", "reguler_price", "image"];
    const createAttr = {};
    variationArray.forEach((item) => {
      const filtered = Object.fromEntries(
        Object.entries(item).filter(([key]) => !removeKeys.includes(key))
      );
      for (const [key, value] of Object.entries(filtered)) {
        if (!createAttr[key]) createAttr[key] = [];
        createAttr[key].push(value);
      }
    });
    for (const key in createAttr) {
      createAttr[key] = [...new Set(createAttr[key])];
    }
    setProductVar(createAttr);
  }, [singleProduct]);

  // When selection changes (or product changes), compute the matched variation (price/image)
  useEffect(() => {
    if (!singleProduct?.variations?.variation_json) {
      setProductAmount(false);
      return;
    }

    let variations;
    try {
      variations = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      setProductAmount(false);
      return;
    }

    // If not all selected or nothing selected, clear amount
    if (
      Object.keys(productVarSelected).length === 0 ||
      (productVar &&
        Object.keys(productVar).length !==
          Object.keys(productVarSelected).length)
    ) {
      setProductAmount(false);
      return;
    }

    const match = variations.find((v) =>
      Object.entries(productVarSelected).every(([key, val]) => v[key] === val)
    );
    setProductAmount(match || false);
  }, [productVarSelected, singleProduct, productVar]);

  // Handle clicking a variation value
  const handleVariation = (type, value) => {
    const isSame = productVarSelected[type] === value;

    if (isSame) {
      // Deselect this attribute
      const updated = { ...productVarSelected };
      delete updated[type];
      setProductVarSelected(updated);

      // If nothing selected anymore, rebuild full attribute list from all variations
      if (Object.keys(updated).length === 0) {
        if (!singleProduct?.variations?.variation_json) return;
        let variationArray;
        try {
          variationArray = JSON.parse(singleProduct.variations.variation_json);
        } catch {
          return;
        }
        const allAttr = {};
        variationArray.forEach((item) => {
          const filteredEntry = Object.fromEntries(
            Object.entries(item).filter(
              ([key]) =>
                ![
                  "sale_price",
                  "stock_status",
                  "reguler_price",
                  "image",
                ].includes(key)
            )
          );
          for (const [k, val] of Object.entries(filteredEntry)) {
            if (!allAttr[k]) allAttr[k] = [];
            allAttr[k].push(val);
          }
        });
        for (const k in allAttr) {
          allAttr[k] = [...new Set(allAttr[k])];
        }
        setProductVar(allAttr);
      }
      return;
    }

    // Select / change attribute
    setProductVarSelected((prev) => ({
      ...prev,
      [type]: value,
    }));

    // Narrow available options based on this selection
    if (!singleProduct?.variations?.variation_json) return;
    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }
    const filtered = variationArray.filter((item) => item[type] === value);
    const removeKeys = [
      "sale_price",
      "stock_status",
      "reguler_price",
      "image",
      `${type}`,
    ];
    const createAttr = {};
    filtered.forEach((item) => {
      const filteredEntry = Object.fromEntries(
        Object.entries(item).filter(([key]) => !removeKeys.includes(key))
      );
      for (const [k, val] of Object.entries(filteredEntry)) {
        if (!createAttr[k]) createAttr[k] = [];
        createAttr[k].push(val);
      }
    });
    for (const k in createAttr) {
      createAttr[k] = [...new Set(createAttr[k])];
    }
    setProductVar((prev) => ({ ...prev, ...createAttr }));
  };

  // Build image slides based on selected variation (color or matched variation image), otherwise galleries
  const getImageSlides = (enableZoom = false, allowExpand  = false) => {
    let variationArray = [];

    if (singleProduct?.variations?.variation_json) {
      try {
        variationArray = JSON.parse(singleProduct.variations.variation_json);
      } catch {
        variationArray = [];
      }
    }

    const renderImage = (src, key) => (
      <div
        key={key}
        className="image-zoom-container"
         onClick={(e) => {
      if (allowExpand) {
        setIsExpanded(true);
      }
    }}
      >
        <img
          src={getVariationImage(src)}
          alt="Product"
          className="zoom-image"
          style={enableZoom && isZooming ? zoomStyle : {}}
          onMouseMove={enableZoom ? handleMouseMove : undefined}
          onMouseEnter={enableZoom ? handleMouseEnter : undefined}
          onMouseLeave={enableZoom ? handleMouseLeave : undefined}
        />
      </div>
    );

    /* ===============================
     1️⃣ FULL VARIATION SELECTED
     (size + colour)
  =============================== */
    if (productAmount?.image && Array.isArray(productAmount.image)) {
      return productAmount.image.map((img, i) =>
        renderImage(img, `variation-${i}`)
      );
    }

    /* ===============================
     2️⃣ ONLY COLOUR SELECTED
  =============================== */
    if (productVarSelected?.colour) {
      const colourMatch = variationArray.find(
        (v) => v.colour === productVarSelected.colour && Array.isArray(v.image)
      );

      if (colourMatch) {
        return colourMatch.image.map((img, i) =>
          renderImage(img, `colour-${i}`)
        );
      }
    }

    /* ===============================
     3️⃣ DEFAULT (NO SELECTION)
     SHOW GALLERY IMAGES
  =============================== */
    if (singleProduct?.galleries?.length) {
      return singleProduct.galleries.map((item, i) =>
        renderImage(item.image, `gallery-${i}`)
      );
    }

    /* ===============================
     4️⃣ LAST FALLBACK
     PRODUCT MAIN IMAGE
  =============================== */
    if (singleProduct?.product_image) {
      return [renderImage(singleProduct.product_image, "main")];
    }

    return [];
  };

  const sliderSettings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    fade: true,
    asNavFor: navSlider,
  };
  const sliderNavSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: mainSlider,
    focusOnSelect: true,
    arrows: true,
    dots: false,
    infinite: getImageSlides.length > 1,
    swipeToSlide: getImageSlides.length > 1,
    centerMode: getImageSlides.length < 1,
    centerPadding: getImageSlides.length < 6 ? "0px" : "0px",
  };
  const sliderNavTwoSettings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    asNavFor: mainSlider,
    focusOnSelect: true,
    arrows: true,
    dots: false,
    vertical: true,
    verticalSwiping: true,
    infinite: getImageSlides.length > 1,
    swipeToSlide: getImageSlides.length > 1,
    centerMode: getImageSlides.length < 1,
    centerPadding: getImageSlides.length < 6 ? "0px" : "0px",
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (rating >= i) {
        stars.push(
          <FontAwesomeIcon key={i} icon={faStar} className="text-warning" />
        );
      } else if (rating >= i - 0.5) {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={faStarHalfAlt}
            className="text-warning"
          />
        );
      } else {
        stars.push(
          <FontAwesomeIcon
            key={i}
            icon={["far", "star"]}
            className="text-warning"
          />
        );
      }
    }
    return stars;
  };
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
        setaddTocart((prev) => [item, ...prev]);
      } else if (data.message === "Product removed from cart") {
        dispatch(cartAction.removeCart(item));
        setaddTocart((prev) => prev.filter((i) => i.id !== item.id));
      }
    } catch (error) {
      console.error("Cart update failed:", error);
      alert("Something went wrong while updating the cart.");
    }
  };
  const submitAction = (formData) => {
    // (kept from your original; no functional change)
    const variation = {};
    let quantity = null;
    let action_type = null;
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("variation")) {
        const match = key.match(/\[\](\[(.*?)\])/);
        if (match && match[2]) {
          variation[match[2]] = value;
        }
      }
      if (key === "quantity") {
        quantity = value;
      }
      if (key === "action_type") {
        action_type = value;
      }
    }
  };
  // Reviews & rating
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    setReviews(singleProduct?.reviews || []);
  }, [singleProduct]);

  const averageRating = reviews.length
    ? (
        reviews.reduce(
          (acc, review) => acc + (review.rating || review.star || 0),
          0
        ) / reviews.length
      ).toFixed(1)
    : "0.0";

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
    <div className="product-detail-slider-content my-xl-5 my-lg-4 my-3 ">
      <ToastContainer />
      <div className="container">
        <div className="row">
          {/* Left: Image sliders */}
          <div className="col-lg-6">
            {/* addedClass */}
            <div
              className={`product-galler-slide ${
                isExpanded ? "addedClass" : ""
              }`}
            >
              <Slider
                {...sliderSettings}
                ref={(slider) => setMainSlider(slider)}
                className="slider slider-for"
              >
                {getImageSlides(true,true)}
              </Slider>

              {/* CLOSE / REMOVE BUTTON */}
              {isExpanded && (
                <button
                  type="button"
                  className="remove-expanded-btn"
                  onClick={(e) => {
                    e.stopPropagation(); // ⛔ STOP bubbling
                    setIsExpanded(false);
                  }}
                >
                  ✕
                </button>
              )}

              {!productVarSelected.color && (
                <Slider
                  {...sliderNavSettings}
                  ref={(slider) => setNavSlider(slider)}
                  className="slider horizontal slider-nav"
                >
                  {getImageSlides()}
                </Slider>
              )}
              {!productVarSelected.color && (
                <Slider
                  {...sliderNavTwoSettings}
                  ref={(slider) => setNavSlider(slider)}
                  className="slider vertiacl slider-nav"
                >
                  {getImageSlides()}
                </Slider>
              )}
            </div>
          </div>

          {/* Right: Product details */}
          <div className="col-lg-5">
            <form action={submitAction} className="product-description">
              <h5>{singleProduct.product_name}</h5>

              <div className="my-xl-3 my-lg-2 my-2">
                <div className="rating d-flex align-items-center">
                  {/* <div className="d-flex align-items-center"> */}
                  {renderStars(averageRating)}
                  {/* <span className="ms-2">
                      {singleProduct.rating} Star Rating ({singleProduct.rating_count} Users)
                    </span> */}
                  {/* </div> */}
                  <span className="ms-2 rating-test d-flex align-items-center">
                    {averageRating} Star Rating{" "}
                    <pre className="mb-0">
                      ( {singleProduct.reviews?.length || 0} Users)
                    </pre>
                  </span>
                </div>
              </div>

              {/* Price block */}
              {productAmount ? (
                <div className="mt-2">
                  <span className="fw-bold fs-4 Pricing">
                    ₹{productAmount.sale_price}
                  </span>
                  <span className="text-decoration-line-through text-muted ms-2 Pricing">
                    ₹{productAmount.reguler_price}
                  </span>
                  <span className="discount ms-2">
                    {(
                      ((productAmount.reguler_price -
                        productAmount.sale_price) /
                        productAmount.reguler_price) *
                      100
                    ).toFixed(0)}
                    % OFF
                  </span>
                </div>
              ) : (
                <div className="mt-2">
                  <span className="fw-bold fs-4 Pricing">
                    ₹{singleProduct.product_discount_price}
                  </span>
                  <span className="text-decoration-line-through text-muted ms-2 Pricing">
                    ₹{singleProduct.product_price}
                  </span>
                  <span className="discount ms-2">
                    {(
                      ((singleProduct.product_price -
                        singleProduct.product_discount_price) /
                        singleProduct.product_price) *
                      100
                    ).toFixed(0)}
                    % OFF
                  </span>
                </div>
              )}

              {/* Variations (render only if productVar has keys) */}
              {
                Object.keys(productVar).map(
                  ([key, values]) => null
                ) /* no-op just to ensure type */
              }
              {Object.keys(productVar).length > 0 &&
                Object.entries(productVar).map(([key, values]) => (
                  <div key={key} className="mb-3">
                    <label className="form-label fw-bold text-capitalize">
                      Select {key}
                    </label>
                    <div className="d-flex gap-2 mt-1 flex-wrap">
                      {values.map((option, idx) => (
                        <button
                          key={idx}
                          type="button"
                          className={`btn ${
                            productVarSelected[key] === option
                              ? "btn-danger"
                              : "btn-outline-secondary"
                          }`}
                          onClick={() => handleVariation(key, option)}
                          name={`variation[][${key}]`}
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

              {/* Hidden inputs for selected variations (kept exactly as yours) */}
              {Object.entries(productVarSelected).map(([key, value]) => (
                <input
                  key={key}
                  type="hidden"
                  name={`variation[][${key}]`}
                  value={value}
                />
              ))}

              {/* <div className="cate-text mt-3">
                <span className="text-success fw-bold">
                  <b className="text-dark">Availability:</b> In Stock
                </span>
              </div> */}

              <div className="cate-text mt-3">
                <span className="text-success fw-bold">
                  <b className="text-dark">Category:</b>{" "}
                  <Link
                    className="fw-bold"
                    to={`/category/${singleProduct.category.slug}`}
                  >
                    {singleProduct.category.name}
                  </Link>
                </span>
              </div>

              <hr className="my-xl-5 my-lg-4 my-3" />

              {/* Purchase buttons */}
              <div className="purchase-btns mt-4 d-flex gap-3 align-items-center  w-100">
                <div className="d-flex">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={decreaseQuantity}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center mx-2"
                    style={{ width: "60px" }}
                    value={quantity}
                    name="quantity"
                    readOnly
                  />
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={increaseQuantity}
                  >
                    +
                  </button>
                </div>
                {singleProduct?.customization === 0 && (
                  <button
                    type="button" // always button to prevent form submit
                    onClick={() => toggleCart(singleProduct)}
                    className={`btn btn-success w-50 ${
                      addTocart.some((item) => item?.id === singleProduct.id)
                        ? "bg-dark"
                        : ""
                    }`}
                  >
                    {addTocart.some((item) => item?.id === singleProduct.id)
                      ? "Remove from Cart"
                      : "Add to Cart"}
                    <FontAwesomeIcon icon={faCartShopping} className="ms-2" />
                  </button>
                )}

                <button
                  type="button"
                  name="action_type"
                  value="buy_now"
                  className="btn btn-outline-dark w-50"
                  onClick={handleBuyNow}
                >
                  BUY NOW
                </button>
              </div>

              <div className="mt-3 wishlist-sec-prodet d-flex align-items-center gap-3 justify-content-between">
                {/* <div className="whiashad d-flex align-items-center gap-2">
                  <FontAwesomeIcon icon={faHeart} />
                  <label>Add to Wishlist</label>
                </div> */}
                {/* <div
                  className="whiashad d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => alert("Product added to wishlist!")}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <label>Add to Wishlist</label>
                </div> */}

                <div
                  className="whiashad d-flex align-items-center gap-2"
                  style={{ cursor: "pointer" }}
                  onClick={() => toggleWishlist(singleProduct)}
                >
                  <FontAwesomeIcon
                    icon={
                      fetch_products?.items?.some(
                        (wish) => wish.product_id === singleProduct?.id
                      )
                        ? faSolidHeart
                        : faRegularHeart
                    }
                    color={
                      fetch_products?.items?.some(
                        (wish) => wish.product_id === singleProduct?.id
                      )
                        ? "red"
                        : "black"
                    }
                  />
                  <label>
                    {fetch_products?.items?.some(
                      (wish) => wish.product_id === singleProduct?.id
                    )
                      ? "Remove from Wishlist"
                      : "Add to Wishlist"}
                  </label>
                </div>

                <div className="share-product d-flex align-items-center">
                  <p>Share product: </p>
                  <ul className="d-flex align-items-center gap-2 list-unstyled mb-0 ms-2">
                    <li style={{ cursor: "pointer" }} onClick={handleCopyLink}>
                      <FontAwesomeIcon icon={faCopy} />
                    </li>
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShare("facebook")}
                    >
                      <FontAwesomeIcon icon={faFacebook} />
                    </li>
                    {/* <li style={{ cursor: "pointer" }} onClick={() => handleShare("twitter")}>
                      <FontAwesomeIcon icon={faXTwitter} />
                    </li> */}
                    <li
                      style={{ cursor: "pointer" }}
                      onClick={() => handleShare("whatsapp")}
                    >
                      <FontAwesomeIcon icon={faWhatsapp} />
                    </li>
                  </ul>
                </div>
              </div>

              <div className="mt-3 Guarantee_Checkout border p-4 bg-light">
                <span>100% Guarantee Safe Checkout</span>
                <div className="paymetn-img mt-3">
                  <img src="/Payment Method.png" alt="Payment Options" />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

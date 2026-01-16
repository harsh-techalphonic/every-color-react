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
import { faStar as farStar } from "@fortawesome/free-regular-svg-icons";
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
  const [cartItem, setCartItem] = useState(null); // Store cart item data
  const dispatch = useDispatch();
  const [mainSlider, setMainSlider] = useState(null);
  const [navSlider, setNavSlider] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetch_products = useSelector((store) => store.wishlist);
  const [gettoken, setGettoken] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({});
  const [isZooming, setIsZooming] = useState(false);
  
  // 🔹 MOBILE TOUCH ZOOM STATES
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [scale, setScale] = useState(1);
  const isImageZoomed = isExpanded && isTouchDevice && scale > 1;
  const [translate, setTranslate] = useState({ x: 0, y: 0 });
  const [lastDistance, setLastDistance] = useState(null);
  const [lastTouch, setLastTouch] = useState(null);

  const hasVariations = Object.keys(productVar).length > 0;
console.log("singleProduct",singleProduct)
  const isAllVariationsSelected =
    !hasVariations ||
    Object.keys(productVarSelected).length === Object.keys(productVar).length;

  const getMissingVariations = () => {
    return Object.keys(productVar).filter(
      (key) => !productVarSelected[key]
    );
  };

  const validateVariations = () => {
    if (!hasVariations) return true;

    if (!isAllVariationsSelected) {
      const missing = getMissingVariations();
      toast.error(`Please select ${missing.join(", ")}`);
      return false;
    }

    return true;
  };

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

  useEffect(() => {
    setIsTouchDevice(
      "ontouchstart" in window || navigator.maxTouchPoints > 0
    );
  }, []);

  const getDistance = (touches) => {
    const [t1, t2] = touches;
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const handleTouchStart = (e) => {
    if (!isExpanded || !isTouchDevice) return;

    if (e.touches.length === 2) {
      setLastDistance(getDistance(e.touches));
    } else if (e.touches.length === 1) {
      setLastTouch({
        x: e.touches[0].clientX - translate.x,
        y: e.touches[0].clientY - translate.y,
      });
    }
  };

  const handleTouchMove = (e) => {
    if (!isExpanded || !isTouchDevice) return;

    e.preventDefault(); // ⛔ stop page zoom

    // 👉 PINCH ZOOM
    if (e.touches.length === 2 && lastDistance) {
      const newDistance = getDistance(e.touches);
      const zoomFactor = newDistance / lastDistance;

      setScale((prev) => Math.min(Math.max(prev * zoomFactor, 1), 4));
      setLastDistance(newDistance);
    }

    // 👉 PAN (only after zoom)
    if (e.touches.length === 1 && lastTouch && scale > 1) {
      setTranslate({
        x: e.touches[0].clientX - lastTouch.x,
        y: e.touches[0].clientY - lastTouch.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setLastDistance(null);
    setLastTouch(null);

    // ✅ Ensure reset if zoom ended at normal scale
    if (scale <= 1) {
      setScale(1);
      setTranslate({ x: 0, y: 0 });
    }
  };

  const handleBuyNow = () => {
    if (!gettoken) {
      navigate("/login");
      return;
    }

    if (!validateVariations()) return;
    const product_img = `${ImageUrl}/${singleProduct.galleries?.[0]?.image || ""}`;
    const buyProduct = {
      id: singleProduct.id,
      product_name: singleProduct.product_name,
      customization: singleProduct.customization,
      product_image: product_img,
      price: productAmount
        ? productAmount.reguler_price
        : singleProduct.product_price,
      discount_price: productAmount
        ? productAmount.sale_price
        : singleProduct.product_discount_price,
      quantity,
      tax: singleProduct.gst_rate,
      cod: singleProduct.cod,
      variation: productVarSelected,
    };

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

  // Check if product is in cart and auto-select variations
  const checkAndApplyCartVariations = () => {
    if (!singleProduct?.cart || !Array.isArray(singleProduct.cart) || singleProduct.cart.length === 0) {
      return;
    }

    const cartData = singleProduct.cart[0]; // Get first cart item
    setCartItem(cartData);
    
    // Set quantity from cart
    if (cartData.quantity) {
      setQuantity(cartData.quantity);
    }
    
    // Auto-select variations from cart
    if (cartData.variation_json && typeof cartData.variation_json === 'object') {
      const selectedVariations = {};
      
      // Check if variation_json is a string that needs parsing
      let variationData = cartData.variation_json;
      if (typeof variationData === 'string') {
        try {
          variationData = JSON.parse(variationData);
        } catch (e) {
          console.error("Error parsing variation_json:", e);
          return;
        }
      }
      
      // Set selected variations
      Object.keys(variationData).forEach(key => {
        if (variationData[key] && variationData[key] !== "") {
          selectedVariations[key] = variationData[key];
        }
      });
      
      if (Object.keys(selectedVariations).length > 0) {
        setProductVarSelected(selectedVariations);
        
        // After setting selections, filter available options
        if (singleProduct?.variations?.variation_json) {
          try {
            const variationArray = JSON.parse(singleProduct.variations.variation_json);
            
            // Find variations that match the cart selections
            const matchingVariations = variationArray.filter((variation) => {
              return Object.entries(selectedVariations).every(([key, val]) => 
                variation[key] === val
              );
            });

            // Build new available attributes based on matching variations
            const excludeKeys = ["sale_price", "stock_status", "reguler_price", "image"];
            const newAvailableAttributes = {};

            matchingVariations.forEach((variation) => {
              Object.entries(variation).forEach(([key, val]) => {
                if (!excludeKeys.includes(key) && 
                    val !== null && 
                    val !== undefined && 
                    val !== "") {
                  if (!newAvailableAttributes[key]) newAvailableAttributes[key] = new Set();
                  newAvailableAttributes[key].add(val);
                }
              });
            });

            // Convert Sets to Arrays
            const result = {};
            Object.keys(newAvailableAttributes).forEach(key => {
              result[key] = Array.from(newAvailableAttributes[key]);
            });
            
            // Update productVar with filtered options
            setProductVar(prev => ({
              ...prev,
              ...result
            }));
          } catch (error) {
            console.error("Error filtering variations:", error);
          }
        }
      }
    }
  };

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
    setCartItem(null);

    if (!singleProduct?.variations?.variation_json) {
      setProductVar({});
      // Check for cart variations even if no variations in product
      setTimeout(() => checkAndApplyCartVariations(), 100);
      return;
    }

    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      setProductVar({});
      setTimeout(() => checkAndApplyCartVariations(), 100);
      return;
    }

    // Define keys to exclude (non-variation fields)
    const excludeKeys = ["sale_price", "stock_status", "reguler_price", "image"];
    
    // Create dynamic attribute object
    const dynamicAttributes = {};
    
    variationArray.forEach((variation) => {
      // Filter out non-variation keys
      Object.entries(variation).forEach(([key, value]) => {
        if (!excludeKeys.includes(key) && 
            value !== null && 
            value !== undefined && 
            value !== "") {
          if (!dynamicAttributes[key]) {
            dynamicAttributes[key] = new Set();
          }
          dynamicAttributes[key].add(value);
        }
      });
    });
    
    // Convert Sets to Arrays for easier handling
    const result = {};
    Object.keys(dynamicAttributes).forEach(key => {
      result[key] = Array.from(dynamicAttributes[key]);
    });
    
    setProductVar(result);
    
    // After building variations, check if product is in cart
    setTimeout(() => checkAndApplyCartVariations(), 100);
  }, [singleProduct]);

  // When selection changes, compute the matched variation (price/image)
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

    // If no variations selected, clear amount
    if (Object.keys(productVarSelected).length === 0) {
      setProductAmount(false);
      return;
    }

    // Find matching variation based on all selected attributes
    const match = variations.find((variation) =>
      Object.entries(productVarSelected).every(([key, value]) => 
        variation[key] === value
      )
    );
    
    setProductAmount(match || false);
  }, [productVarSelected, singleProduct]);

  // Handle clicking a variation value with improved logic
  const handleVariation = (type, value) => {
    const isCurrentlySelected = productVarSelected[type] === value;

    if (isCurrentlySelected) {
      // Deselect this attribute
      const updatedSelections = { ...productVarSelected };
      delete updatedSelections[type];
      setProductVarSelected(updatedSelections);

      // If no attributes selected, rebuild full attribute list from all variations
      if (Object.keys(updatedSelections).length === 0) {
        rebuildFullAttributes();
      } else {
        // Rebuild available attributes based on remaining selections
        filterAvailableAttributes(updatedSelections);
      }
      return;
    }

    // Select new attribute
    const newSelections = {
      ...productVarSelected,
      [type]: value,
    };
    
    setProductVarSelected(newSelections);
    
    // Filter available options based on current selection
    filterAvailableAttributes(newSelections);
  };

  // Helper function to rebuild full attributes from all variations
  const rebuildFullAttributes = () => {
    if (!singleProduct?.variations?.variation_json) return;
    
    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }

    const excludeKeys = ["sale_price", "stock_status", "reguler_price", "image"];
    const allAttributes = {};
    
    variationArray.forEach((variation) => {
      Object.entries(variation).forEach(([key, val]) => {
        if (!excludeKeys.includes(key) && 
            val !== null && 
            val !== undefined && 
            val !== "") {
          if (!allAttributes[key]) allAttributes[key] = new Set();
          allAttributes[key].add(val);
        }
      });
    });
    
    // Convert Sets to Arrays
    const result = {};
    Object.keys(allAttributes).forEach(key => {
      result[key] = Array.from(allAttributes[key]);
    });
    
    setProductVar(result);
  };

  // Helper function to filter available attributes based on current selections
  const filterAvailableAttributes = (selections) => {
    if (!singleProduct?.variations?.variation_json) return;
    
    let variationArray;
    try {
      variationArray = JSON.parse(singleProduct.variations.variation_json);
    } catch {
      return;
    }

    // Find variations that match all current selections
    const matchingVariations = variationArray.filter((variation) => {
      return Object.entries(selections).every(([key, val]) => 
        variation[key] === val
      );
    });

    // Build new available attributes based on matching variations
    const excludeKeys = ["sale_price", "stock_status", "reguler_price", "image"];
    const newAvailableAttributes = {};

    matchingVariations.forEach((variation) => {
      Object.entries(variation).forEach(([key, val]) => {
        if (!excludeKeys.includes(key) && 
            val !== null && 
            val !== undefined && 
            val !== "") {
          if (!newAvailableAttributes[key]) newAvailableAttributes[key] = new Set();
          newAvailableAttributes[key].add(val);
        }
      });
    });

    // Convert Sets to Arrays and update state
    const result = {};
    Object.keys(newAvailableAttributes).forEach(key => {
      result[key] = Array.from(newAvailableAttributes[key]);
    });
    
    // Merge with existing productVar, but only for attributes not yet selected
    const updatedAttributes = { ...productVar };
    Object.keys(result).forEach((key) => {
      if (!selections[key]) { // Only update attributes that aren't selected yet
        updatedAttributes[key] = result[key];
      }
    });

    setProductVar(updatedAttributes);
  };

  // Check if current selection matches cart selection
  const isCartSelection = (key, value) => {
    if (!cartItem?.variation_json) return false;
    
    let variationData = cartItem.variation_json;
    if (typeof variationData === 'string') {
      try {
        variationData = JSON.parse(variationData);
      } catch {
        return false;
      }
    }
    
    return variationData[key] === value;
  };

  // Build image slides based on selected variation
  const getImageSlides = (enableZoom = false, allowExpand = false) => {
    let variations = [];

    if (singleProduct?.variations?.variation_json) {
      try {
        variations = JSON.parse(singleProduct.variations.variation_json);
      } catch {
        variations = [];
      }
    }

    const renderImage = (src, key) => (
      <div
        key={key}
        className="image-zoom-container"
        onClick={() => allowExpand && setIsExpanded(true)}
      >
        <img
          src={getVariationImage(src)}
          alt="Product"
          className="zoom-image"
          style={{
            ...(enableZoom && !isTouchDevice && isZooming ? zoomStyle : {}),
            ...(isExpanded && isTouchDevice
              ? {
                  transform: `scale(${scale}) translate(${translate.x / scale}px, ${translate.y / scale}px)`,
                  touchAction: "none",
                }
              : {}),
          }}
          onMouseMove={!isTouchDevice && enableZoom ? handleMouseMove : undefined}
          onMouseEnter={!isTouchDevice && enableZoom ? handleMouseEnter : undefined}
          onMouseLeave={!isTouchDevice && enableZoom ? handleMouseLeave : undefined}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>
    );

    /* =====================================
       1️⃣ FULL / PARTIAL VARIATION MATCH
       (DYNAMIC KEYS)
    ===================================== */
    if (Object.keys(productVarSelected).length && variations.length) {
      const matchedVariation = variations.find((v) =>
        Object.entries(productVarSelected).every(
          ([key, val]) => v[key] === val
        )
      );

      if (matchedVariation?.image) {
        const imagesArray = Array.isArray(matchedVariation.image)
          ? matchedVariation.image
          : [matchedVariation.image]; // 👈 normalize

        return imagesArray.map((img, i) =>
          renderImage(img, `var-${i}`)
        );
      }
    }

    /* =====================================
       2️⃣ DEFAULT GALLERY
    ===================================== */
    if (singleProduct?.galleries?.length) {
      return singleProduct.galleries.map((item, i) =>
        renderImage(item.image, `gallery-${i}`)
      );
    }

    /* =====================================
       3️⃣ FALLBACK MAIN IMAGE
    ===================================== */
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
    swipe: !isImageZoomed,
    draggable: !isImageZoomed,
    touchMove: !isImageZoomed,
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
    centerPadding: getImageSlides.length < 6 ? "0px" : "0px",
  };
  
  const sliderNavTwoSettings = {
    slidesToShow: 5,
    slidesToScroll: 1,
    asNavFor: mainSlider,
    focusOnSelect: true,
    arrows: false,
    dots: false,
    vertical: true,
    verticalSwiping: true,
    infinite: getImageSlides.length > 1,
    swipeToSlide: getImageSlides.length > 1,
    centerMode: false,
    centerPadding: "0px",
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
            // icon={["fa", "star"]}
            icon={farStar}
            className="text-warning"
          />
        );
      }
    }
    return stars;
  };

  const toggleCart = async (item) => {
    if (!gettoken) {
      navigate("/login");
      return;
    }

    if (!validateVariations()) return;

    try {
        const requestBody = {
    product_id: item?.id,
    variation: productVarSelected,
    quantity: isProductInCart ? 0 : quantity,
  };

  // Console the data that's going in the body
  console.log("📦 Cart API Request Body:", {
    requestBody,
  });
      const response = await fetch(`${API_URL}${AddOrRemoveCart}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${gettoken}`,
        },
        body: JSON.stringify({
          product_id: item?.id,
          variation: productVarSelected,
          quantity,
        }),
      });
      
      if (!response.ok) throw new Error("Failed to update cart.");
      
      const data = await response.json();
      
      
      if (data.message === "Product added to cart") {
        dispatch(cartAction.addCart(item));
        setaddTocart((prev) => [item, ...prev]);
        toast.success("Product added to cart!");
      } else if (data.message === "Product removed from cart") {
        dispatch(cartAction.removeCart(item));
        setaddTocart((prev) => prev.filter((i) => i.id !== item.id));
        toast.success("Product removed from cart!");
        
      }
      setTimeout(() => window.location.reload(), 4000);
      
    } catch (error) {
      console.error("Cart update failed:", error);
      toast.error("Something went wrong while updating the cart.");
    }
  };

  const submitAction = (formData) => {
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
        toast.success("Added to wishlist!");
      } else if (data.message.toLowerCase().includes("removed")) {
        dispatch(wishlistAction.removeFromWishlist(item.id));
        setWishlist((prev) => {
          const updated = prev.filter((wid) => wid !== item.id);
          localStorage.setItem("wishlist", JSON.stringify(updated));
          return updated;
        });
        toast.success("Removed from wishlist!");
      }
    } catch (error) {
      console.error("Wishlist update failed:", error);
      toast.error("Something went wrong while updating the wishlist.");
    }
  };

  // Render variation options with cart indicator
  const renderVariations = () => {
    if (Object.keys(productVar).length === 0) {
      return null;
    }

    const isProductInCart = singleProduct?.cart && singleProduct.cart.length > 0;

    return Object.entries(productVar).map(([key, values]) => {
      // Check if options are available for this variation
      const isOptionAvailable = values && values.length > 0;
      
      return (
        <div key={key} className="mb-3">
          <label className="form-label fw-bold text-capitalize">
            Select {key.replace(/_/g, ' ')}
            {!productVarSelected[key] && <span className="text-danger ms-1">*</span>}
            {isProductInCart && productVarSelected[key] && (
              <span className="ms-2 badge bg-success">
                <small>In Cart</small>
              </span>
            )}
          </label>
          <div className="d-flex gap-2 mt-1 flex-wrap">
            {isOptionAvailable ? (
              values.map((option, idx) => {
                const isSelected = productVarSelected[key] === option;
                const isCartSelected = isProductInCart && isCartSelection(key, option);
                
                return (
                  <button
                    key={`${key}-${idx}`}
                    type="button"
                    className={`btn ${
                      isSelected
                        ? isCartSelected 
                          ? "btn-success" // Green for cart selection
                          : "btn-danger"  // Red for user selection (not from cart)
                        : isCartSelected
                        ? "btn-warning"  // Yellow for cart selection that's not currently selected
                        : "btn-outline-secondary"
                    } variation-btn position-relative`}
                    onClick={() => handleVariation(key, option)}
                    name={`variation[][${key}]`}
                  >
                    {option}
                    {isCartSelected && (
                      <span className="position-absolute top-0 start-100 translate-middle p-1 bg-success border border-light rounded-circle">
                        <span className="visually-hidden">In Cart</span>
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <span className="text-muted">No options available with current selection</span>
            )}
          </div>
        </div>
      );
    });
  };

  // Check if product is in cart
  const isProductInCart = singleProduct?.cart && singleProduct.cart.length > 0;
  const cartButtonText = isProductInCart ? "Remove from Cart" : "Add to Cart";

  return (
    <div className="product-detail-slider-content my-xl-5 my-lg-4 my-3 ">
      <ToastContainer />
      <div className="container">
        <div className="row">
          {/* Left: Image sliders */}
          <div className="col-lg-6">
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
                {getImageSlides(true, true)}
              </Slider>

              {/* CLOSE / REMOVE BUTTON */}
              {isExpanded && (
                <button
                  type="button"
                  className="remove-expanded-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsExpanded(false);
                    setScale(1);
                    setTranslate({ x: 0, y: 0 });
                  }}
                >
                  ✕
                </button>
              )}

              {/* Navigation sliders */}
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
          <div className="col-lg-5 offset-lg-1">
            <form action={submitAction} className="product-description">
              <h5>{singleProduct.product_name}</h5>

              <div className="my-xl-3 my-lg-2 my-2">
                <div className="rating d-flex align-items-center">
                  {renderStars(averageRating)}
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

              {/* Cart Indicator */}
              {isProductInCart && (
                <div className="alert alert-info mt-3 py-2">
                  <div className="d-flex align-items-center">
                    <FontAwesomeIcon icon={faCartShopping} className="me-2" />
                    <div>
                      <strong>This product is in your cart</strong>
                      <div className="small">
                        Selected: {Object.entries(productVarSelected).map(([key, value]) => (
                          <span key={key} className="badge bg-light text-dark ms-1">
                            {key}: {value}
                          </span>
                        ))}
                        <span className="ms-2">• Qty: {quantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Variations */}
              {renderVariations()}

              {/* Selected variations indicator */}
              {Object.keys(productVarSelected).length > 0 && (
                <div className="mb-3">
                  <small className="text-muted">
                    Selected:{" "}
                    {Object.entries(productVarSelected).map(([key, value], index) => (
                      <span key={key} className={`badge ${isCartSelection(key, value) ? 'bg-success' : 'bg-info'} ms-1`}>
                        {key}: {value}
                        {isCartSelection(key, value) && <span className="ms-1">✓</span>}
                      </span>
                    ))}
                  </small>
                </div>
              )}

              {/* Hidden inputs for selected variations */}
              {Object.entries(productVarSelected).map(([key, value]) => (
                <input
                  key={key}
                  type="hidden"
                  name={`variation[][${key}]`}
                  value={value}
                />
              ))}

              {/* Category */}
              <div className="cate-text mt-3">
                <span className="text-success fw-bold">
                  <b className="text-dark">Category:</b>{" "}
                  <Link
                    className="fw-bold"
                    to={`/category/${singleProduct.category?.slug}`}
                  >
                    {singleProduct.category?.name || "Uncategorized"}
                  </Link>
                </span>
              </div>

              {/* Stock Status */}
              {singleProduct?.stock_status !== undefined && (
                <div className="cate-text mt-2">
                  <span className="fw-bold">
                    <b className="text-dark">Availability:</b>{" "}
                    <span className={
                      singleProduct.stock_status === "in_stock" 
                        ? "text-success" 
                        : "text-danger"
                    }>
                      {singleProduct.stock_status === "in_stock" 
                        ? "In Stock" 
                        : "Out of Stock"}
                    </span>
                  </span>
                </div>
              )}

              <hr className="my-xl-5 my-lg-4 my-3" />

              {/* Purchase buttons */}
              <div className="purchase-btns mt-4 d-flex gap-3 align-items-center w-100">
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
                    type="button"
                    onClick={() => toggleCart(singleProduct)}
                    className={`btn w-50 ${
                      isProductInCart
                        ? "btn-danger"
                        : "btn-success"
                    }`}
                    disabled={singleProduct?.stock_status === "out_of_stock"}
                  >
                    {cartButtonText}
                    <FontAwesomeIcon icon={faCartShopping} className="ms-2" />
                  </button>
                )}
                
                <button
                  type="button"
                  name="action_type"
                  value="buy_now"
                  className="btn btn-outline-dark w-50"
                  onClick={handleBuyNow}
                  disabled={singleProduct?.stock_status === "out_of_stock"}
                >
                  BUY NOW
                </button>
              </div>

              <div className="mt-3 wishlist-sec-prodet d-flex align-items-center gap-3 justify-content-between">
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
                  <p className="mb-0">Share product: </p>
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
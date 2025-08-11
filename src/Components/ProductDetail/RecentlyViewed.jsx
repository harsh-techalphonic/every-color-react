import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import {
  faArrowRightLong,
  faBagShopping,
  faStar,
  faStarHalfAlt,
} from "@fortawesome/free-solid-svg-icons";
import { faHeart as faRegularHeart } from "@fortawesome/free-regular-svg-icons";
import { faHeart as faSolidHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";

export default function RecentlyViewed() {
  // Safely select Redux state
  const fetch_singleProduct = useSelector((store) => store.singleProduct?.data || []);
  const products = useSelector((store) => store.recentView?.products || []);

  const [singleProduct, setSingleProduct] = useState(null);
  const { slug } = useParams();

  useEffect(() => {
    if (!Array.isArray(fetch_singleProduct) || fetch_singleProduct.length === 0) return;

    const existingProduct = fetch_singleProduct.find(
      (product) => product.product_slug === slug
    );

    if (existingProduct) {
      setSingleProduct(existingProduct);
    }
  }, [fetch_singleProduct, slug]);

  const [wishlist, setWishlist] = useState({});

  const toggleWishlist = (id) => {
    setWishlist((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 4,
    arrows: true,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      { breakpoint: 1200, settings: { slidesToShow: 4, slidesToScroll: 3 } },
      { breakpoint: 992, settings: { slidesToShow: 3, slidesToScroll: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <section className="Best_selling my-5">
      <div className="container">
        <div className="feature-product-tile d-flex align-items-center justify-content-between">
          <div className="title-box">
            <h2>
              <span>Recently</span> Viewed
            </h2>
          </div>
          <div className="title-box">
            <a href="#!">
              View All <FontAwesomeIcon icon={faArrowRightLong} />
            </a>
          </div>
        </div>

        <div className="featureslider_one my-4">
          {Array.isArray(products) && products.length > 0 ? (
            <Slider {...settings} className="xyzg-slider">
              {products.map((product) => (
                <div key={product.id} className="feature-card">
                  {product.product_discount && (
                    <span className="disco">{product.product_discount}</span>
                  )}

                  <span
                    className="wishicon"
                    onClick={() => toggleWishlist(product.id)}
                    style={{ cursor: "pointer", fontSize: "16px" }}
                  >
                    <FontAwesomeIcon
                      icon={wishlist[product.id] ? faSolidHeart : faRegularHeart}
                      color={wishlist[product.id] ? "red" : "black"}
                    />
                  </span>

                  <div className="card-img">
                    <img
                      src={product.product_image}
                      alt={product.product_name || "Product"}
                    />
                  </div>

                  <div className="product-detail">
                    <h3>
                      <Link to={`/product/${product.product_slug || "#"}`}>
                        {product.product_name || "No Name"}
                      </Link>
                    </h3>
                    <div className="rating d-flex align-items-center">
                      {[...Array(Math.floor(product.rating || 0))].map((_, i) => (
                        <FontAwesomeIcon key={i} icon={faStar} />
                      ))}
                      {(product.rating || 0) % 1 !== 0 && (
                        <FontAwesomeIcon icon={faStarHalfAlt} />
                      )}
                      <span>({product.reviews || 0})</span>
                    </div>
                    <div className="Pricing d-flex align-items-center">
                      <p className="price">₹ {product.product_price}</p>
                      {product.product_discount_price && (
                        <p className="slashPrice">₹ {product.product_discount_price}</p>
                      )}
                    </div>
                  </div>

                  <a href="#!" className="cart-btn">
                    Add to Cart{" "}
                    <FontAwesomeIcon icon={faBagShopping} className="ms-2" />
                  </a>
                </div>
              ))}
            </Slider>
          ) : (
            <p>No recently viewed products found.</p>
          )}
        </div>
      </div>
    </section>
  );
}

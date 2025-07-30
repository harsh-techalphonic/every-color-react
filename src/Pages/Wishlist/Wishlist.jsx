import React, { useEffect, useState } from 'react';
import './Wishlist.css';
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBagShopping, faHouse, faStar, faStarHalfAlt } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { useDispatch, useSelector } from 'react-redux';
import ProductsApi from '../../API/ProductsApi';
import { wishlistAction } from '../../store/Products/wishlistSlice';
import ScrollToTop from '../ScrollToTop';

export default function Wishlist() {
  const fetch_products = useSelector((store) => store.products);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (fetch_products.status && localStorage.getItem("wishlist")) {
      const wishlistIds = new Set(JSON.parse(localStorage.getItem("wishlist"))); // Use Set for faster lookup
      setProducts(fetch_products.data.filter(product => wishlistIds.has(product.prd_id))); // Use `.has()` for O(1) lookup
    }
  }, [fetch_products.status]);

  const removeWishlist = (id) => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist"));
    wishlist = wishlist.filter(num => num !== id);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    dispatch(wishlistAction.addWishlist(wishlist.length));
    setProducts(products.filter(product => product.prd_id !== id));
  };

  return (
    <>
    <ScrollToTop/>
      <Header />
          <div className='breadcrum_box mt-2'>
            <nav aria-label="breadcrumb">
              <div className="container">
                <ol className="breadcrumb mb-0">
                  <li className="breadcrumb-item">
                    <Link to="/home" className='d-flex align-items-center gap-2'>
                      <FontAwesomeIcon icon={faHouse} style={{fontSize:"14px",marginTop:"-4px"}} /> Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active" aria-current="page">Wishlists</li>
                </ol>
              </div>
            </nav>
          </div>
      <div className='wishlist-box my-5'>
        <div className='container'>
          <div className="cart-title d-flex align-items-center justify-content-center mb-5">
              <h2>Product <span> Wishlist</span></h2>
              <ProductsApi />
          </div>
          <div className="wishlistTitle_btn d-flex justify-content-between mb-3">
            <h3 className="uppercase">Wishlist</h3>
          <Link to="/product">Shop Now</Link>
        </div>
          <div className='row Product_card'>
            {products.map((product) => (
              <div key={product.prd_id} className='col-lg-3 col-md-6 col-sm-6 mb-3'>
                <div className="feature-card">
                  <span className="disco">{Math.round(((product.price - product.discount_price) / product.price) * 100)}%</span>
                  <span className="wishicon" onClick={() => removeWishlist(product.prd_id)} style={{ cursor: 'pointer' }}>
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </span>
                  <Link to={product.link}>
                    <div className="card-img">
                      <img src={product.img_url} alt={product.title} />
                    </div>
                  </Link>
                  <div className="product-detail">
                    <h3><Link to={`/product/${product.slug}`}>{product.title}</Link></h3>
                    <div className="rating d-flex align-items-center ">
                      <FontAwesomeIcon key={0} icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStar} />
                      <FontAwesomeIcon icon={faStarHalfAlt} />
                      <span>({product.avg_ratting})</span>
                    </div>
                    <div className="Pricing d-flex align-items-center">
                    <p className="price">₹ {product.discount_price} </p>
                    <p className="slashPrice">₹ {product.price} </p>
                    </div>
                    <a href="/cart" className="cart-btn">Add to Cart <FontAwesomeIcon icon={faBagShopping} /></a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
      <Footer/>
    </>
  )
}

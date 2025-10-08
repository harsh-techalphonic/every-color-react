import React, { useEffect, useState } from "react";
import "./Cart.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { cartAction } from "../../store/Products/cartSlice";
import config from "../../Config/config.json";
import { deleteCartItem } from "../../API/AllApiCode";
import { RemoveCart } from "../../Config/config";
import { updateCartItemQuantity } from "./CartValUpdateApi";

// Utility to calculate prices
const getPriceDetails = (item) => {
  if (
    item.product_inventory_details.length > 0 &&
    item.product_inventory_details[0].variation_json
  ) {
    const variations = JSON.parse(
      item.product_inventory_details[0].variation_json
    );
    const match = variations?.find((v) =>
      Object.entries(item.variation || {}).every(([key, val]) => v[key] === val)
    );
    if (match) {
      return {
        salePrice: Number(match.sale_price),
        regularPrice: Number(match.reguler_price),
        total: Number(match.sale_price) * item.quantity,
        subTotal: Number(match.reguler_price) * item.quantity,
        discount:
          (Number(match.reguler_price) - Number(match.sale_price)) *
          item.quantity,
      };
    }
  }

  // Fallback for simple products
  return {
    salePrice: Number(item.discount_price),
    regularPrice: Number(item.price),
    total: Number(item.discount_price) * item.quantity,
    subTotal: Number(item.price) * item.quantity,
    discount:
      (Number(item.price) - Number(item.discount_price)) * item.quantity,
  };
};

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [priceData, setPriceData] = useState(null);

  useEffect(() => {
    setPriceData(getPriceDetails(item));
  }, [item]);

  const handleIncrement = () =>
    onQuantityChange(item?.prd_id, item.quantity + 1);
  const handleDecrement = () =>
    item.quantity > 1 && onQuantityChange(item?.prd_id, item.quantity - 1);

  return (
    <div className="card mb-3 p-3">
      <div className="d-flex align-items-center gap-4">
        <div className="cartitem_img">
          <img
            src={item.product_image}
            alt={item.product_name}
            className="img-fluid"
          />
        </div>
        <div className="cartitem_content">
          <h5>{item.product_name}</h5>
          {priceData && (
            <div className="price_ing d-flex align-items-center">
              <h5>₹{priceData.total.toFixed(2)}</h5>
              <p className="slashPrice">₹{priceData.subTotal.toFixed(2)}</p>
            </div>
          )}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleDecrement}
            >
              -
            </button>
            <input
              className="form-control mx-2"
              style={{ width: "50px" }}
              value={item.quantity}
              readOnly
            />
            <button
              className="btn btn-outline-secondary btn-sm"
              onClick={handleIncrement}
            >
              +
            </button>
          </div>
        </div>
        <button
          className="btn btn-outline-danger remove_btn"
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faTrashAlt} />
        </button>
      </div>
    </div>
  );
};

export default function Cart() {
  const [products, setProducts] = useState([]);
  const [checkCart, setCheckCart] = useState(false);
  const [checkoutDetail, setCheckoutDetail] = useState({
    subTotal: 0,
    productDiscount: 0,
    total: 0,
  });
  const [checkoutUrl, setCheckoutUrl] = useState("");
  const dispatch = useDispatch();

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${config.API_URL}${config.GetCartList}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();

      if (result.status && result.data.length > 0) {
        const cartData = result.data.map((cartItem) => {
          const product = cartItem.product;
          const variation = cartItem.variation || {};

          return {
            ...product,
            cart_id: cartItem.id,
            prd_id: product?.id,
            quantity: cartItem.quantity || 1,
            variation,
            product_inventory_details: product?.variations
              ? [product?.variations]
              : [],
            price: Number(product?.product_price),
            discount_price: Number(product?.product_discount_price),
          };
        });

        dispatch(cartAction.setCart(cartData));
        setProducts(cartData);
        setCheckCart(false);
      } else {
        setCheckCart(true);
        dispatch(cartAction.setCart([]));
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCheckCart(true);
    }
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(
      `Are you sure you want to remove product from your cart?`
    );
    if (!confirmDelete) return;

    try {
      const success = await deleteCartItem(item.cart_id, RemoveCart);
      if (success) {
        fetchCart();
        setProducts((prev) => prev.filter((p) => p?.id !== item?.id));
      } else {
        console.error("Failed to delete item from cart.");
      }
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    const url = JSON.stringify({ ...checkoutDetail, data: cartIds });
    const encodedUrl = btoa(encodeURIComponent(url));
    setCheckoutUrl(encodedUrl);
  }, [checkoutDetail]);

  // Recalculate totals
  useEffect(() => {
    if (products.length === 0) return;

    let totalSub = 0;
    let productDisc = 0;

    products.forEach((item) => {
      const { subTotal, discount } = getPriceDetails(item);
      totalSub += subTotal;
      productDisc += discount;
    });

    setCheckoutDetail((prev) => ({
      ...prev,
      subTotal: totalSub,
      productDiscount: productDisc,
      total: totalSub - productDisc,
    }));
  }, [products]);

  // Quantity change
  const handleQuantityChange = async (prd_id, newQuantity) => {
    try {
      const response = await updateCartItemQuantity(prd_id, newQuantity);
      if (response) {
        setProducts((prevItems) =>
          prevItems.map((item) =>
            item?.prd_id === prd_id ? { ...item, quantity: newQuantity } : item
          )
        );
        dispatch(cartAction.updateCart({ prd_id, quantity: newQuantity }));
      } else {
        alert("Failed to update cart quantity");
      }
    } catch (err) {
      console.error("Quantity update error:", err);
    }
  };

  return (
    <>
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
                Cart
              </li>
            </ol>
          </div>
        </nav>
      </div>

      <section className="cart_section mt-5">
        <div className="container">
          <div className="row justify-content-center">
            {checkCart === false && products.length === 0 ? (
              <div className="col-12 text-center">
                <div className="spinner-grow text-dark me-3" role="status" />
                <div className="spinner-grow text-dark me-3" role="status" />
                <div className="spinner-grow text-dark me-3" role="status" />
              </div>
            ) : products?.length > 0 ? (
              <>
                <div className="col-lg-6 col-md-8">
                  <div className="Cart_sect-box">
                    <h4 className="mb-3">Cart ({products?.length} items)</h4>
                    {products.map((item) => (
                      <CartItem
                        key={item?.prd_id}
                        item={item}
                        onRemove={() => handleDelete(item)}
                        onQuantityChange={handleQuantityChange}
                      />
                    ))}
                  </div>
                </div>

                <div className="col-lg-4 col-md-4">
                  <div
                    className="Checkout_box p-4 mt-5"
                    style={{
                      maxWidth: "400px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                    }}
                  >
                    <h5 className="mb-4">The total amount of</h5>
                    <div className="list-box d-flex justify-content-between mb-2">
                      <span>Sub-total</span>
                      <span>₹{checkoutDetail.subTotal.toFixed(2)}</span>
                    </div>
                    <div className="list-box d-flex justify-content-between mb-2">
                      <span>Discount</span>
                      <span>- ₹{checkoutDetail.productDiscount.toFixed(2)}</span>
                    </div>
                    <div className="list-box d-flex justify-content-between mb-3">
                      <span>Tax (18%)</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="list-box d-flex justify-content-between mb-4">
                      <h5>Total</h5>
                      <h5>₹{checkoutDetail.total.toFixed(2)}</h5>
                    </div>
                    <Link
                      to={`/checkout`}
                      className="btn btn-primary w-100 rounded-0 py-2"
                      state={{ CartData: products, Total: checkoutDetail }}
                    >
                      PROCEED TO CHECKOUT →
                    </Link>
                  </div>
                </div>
              </>
            ) : (
              <h2 className="text-center">Your cart is empty..!</h2>
            )}
          </div>

          <div className="continueshop_btn my-5">
            <div className="row">
              <div className="offset-lg-1 col-lg-11 col-md-12">
                <Link to="/product">Continue Shopping</Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

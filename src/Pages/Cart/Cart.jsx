import React, { useCallback, useEffect, useState } from "react";
import "./Cart.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cartAction } from "../../store/Products/cartSlice";

const CartItem = ({ item, onRemove, onQuantityChange }) => {
  const [productAmount, setProductAmount] = useState(false);
  useEffect(() => {
    if (item.product_inventory_details.length == 0) return;

    const variations = JSON.parse(
      item.product_inventory_details[0].variation_json
    );

    const match = variations.find((v) =>
      Object.entries(item.variation).every(([key, val]) => v[key] === val)
    );
    setProductAmount(match);
  }, [item]);

  const handleIncrement = () =>
    onQuantityChange(item.prd_id, item.quantity + 1);
  const handleDecrement = () =>
    item.quantity > 1 && onQuantityChange(item.prd_id, item.quantity - 1);

  return (
    <div className="card mb-3 p-3">
      <div className="d-flex align-items-center gap-4">
        <div className="cartitem_img">
          <img src={item.img_url} alt={item.title} className="img-fluid" />
        </div>
        <div className="cartitem_content">
          <h5>{item.title}</h5>
          <div>
            {item.variation
              ? Object.entries(item.variation).map(([key, value]) => (
                  <span key={key} className="badge text-bg-dark m-1">
                    {key} : {value}
                  </span>
                ))
              : ""}
          </div>
          <div className="price_ing d-flex align-items-center">
            {/* {item.product_inventory_details.length != 0 ? :''} */}
            {productAmount ? (
              <>
                <h5>
                  ₹{(productAmount.sale_price * item.quantity).toFixed(2)}
                </h5>
                <p className="slashPrice">₹ {productAmount.reguler_price * item.quantity} </p>
              </>
            ) : (
              <>
                <h5>₹{(item.discount_price * item.quantity).toFixed(2)}</h5>
                <p className="slashPrice">₹ {item.price} </p>
              </>
            )}
          </div>
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
  const fetch_products = useSelector((store) => store.products);
  const [products, setProducts] = useState([]);
  const [checkCart, setCheckCart] = useState(false);
  const [checkoutDetail, setCheckoutDetail] = useState({subTotal:0,discount:0,total:0});
  const [checkoutUrl,setCheckoutUrl] = useState('');
  // console.log(checkoutDetail)
  const dispatch = useDispatch();
  useEffect(() => {
    if (fetch_products.status && localStorage.getItem("cart")) {
      const cartIds = JSON.parse(localStorage.getItem("cart"));

      setProducts(
        fetch_products.data
          .filter((product) =>
            cartIds.some((cartItem) => cartItem.prd_id === product.prd_id)
          )
          .map((product) => {
            const cartItem = cartIds.find(
              (cartItem) => cartItem.prd_id === product.prd_id
            );
            let variation = cartItem.variation
              ? { variation: cartItem.variation }
              : {};
            return {
              ...product,
              quantity: cartItem ? cartItem.quantity : 1,
              ...variation,
            };
          })
      );

      if (cartIds.length == 0) {
        setCheckCart(true);
      }
    } else {
      setCheckCart(true);
    }
  }, [fetch_products.status]);

  useEffect(()=>{
    const cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    const url = JSON.stringify({...checkoutDetail,data:cartIds});
    console.log(btoa(url), {...checkoutDetail,data:cartIds})
    setCheckoutUrl(btoa(url))
  },[checkoutDetail]);

  let test = [];

  const manager = useCallback((obj)=>{
    test.push(obj);
    if(products.length != test.length) return;
    const totals = test.reduce((acc, item) => {
      acc.subTotal += item.subTotal;
      acc.discount += item.discount;
      acc.total += item.total;
      return acc;
    }, { subTotal: 0, discount: 0, total: 0 });
    
    setCheckoutDetail(totals);
  }, [products])
  useEffect(() => {
    if (products.length == 0) return;
    products.map((item, index) => {
      if (item.product_inventory_details.length == 0) {
        manager({
          subTotal: Number(item.price) * item.quantity,
          discount: Number(item.price * item.quantity) - Number(item.discount_price * item.quantity),
          total: Number(item.discount_price * item.quantity),
        });
        // localStorage.setItem(`tempsss`, JSON.stringify({subTotal : item.price,discount :(item.price - item.discount_price),total:item.discount_price}))
      } else {
        const variations = JSON.parse(
          item.product_inventory_details[0].variation_json
        );
        const match = variations.find((v) =>
          Object.entries(item.variation).every(([key, val]) => v[key] === val)
        );
        manager({
            subTotal: Number(match.reguler_price * item.quantity),
            discount: Number(match.reguler_price * item.quantity) - Number(match.sale_price * item.quantity),
            total: Number(match.sale_price * item.quantity),
          });
        // localStorage.setItem(`tempsss${index}`, JSON.stringify())
      }
    });
  }, [products]);

  useEffect(() => {}, []);

  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageColor, setCouponMessageColor] = useState("");

  const handleQuantityChange = (id, newQuantity) => {
    setProducts((prevItems) =>
      prevItems.map((item) =>
        item.prd_id === id ? { ...item, quantity: newQuantity } : item
      )
    );
    dispatch(cartAction.updateCart({ id, quantity: newQuantity }));
  };

  const handleRemove = (id) => {
    let cartIds = JSON.parse(localStorage.getItem("cart")) || [];
    cartIds = cartIds.filter((item) => item.prd_id !== id);
    // console.log(cartIds)
    localStorage.setItem("cart", JSON.stringify(cartIds));
    setProducts(products.filter((item) => item.prd_id !== id));
    dispatch(
      cartAction.removeCart(products.filter((item) => item.prd_id !== id))
    );
  };
  const subTotal = products.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const subTotalDiscount = products.reduce(
    (sum, item) => sum + item.discount_price * item.quantity,
    0
  );
  const shipping = 0;
  const discount = subTotal - subTotalDiscount;
  const tax = subTotalDiscount * 0.18;
  const total = subTotalDiscount + shipping + tax - discount;

  const applyCoupon = () => {
    if (coupon === "DISCOUNT180") {
      setIsCouponApplied(true);
      setCouponMessage("Coupon Applied! ₹180 discount added.");
      setCouponMessageColor("green");
    } else {
      setCouponMessage("Invalid Coupon Code!");
      setCouponMessageColor("red");
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
                  />{" "}
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
            {checkCart == false && products.length == 0 ? (
              <div className="col-12 text-center">
                <div className="spinner-grow text-dark me-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-dark me-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <div className="spinner-grow text-dark me-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : products.length > 0 ? (
              <>
                <div className="col-lg-6 col-md-8">
                  <div className="Cart_sect-box">
                    <h4 className="mb-3">Cart ({products.length} items)</h4>
                    {products.map((item) => (
                      <CartItem
                        key={item.prd_id}
                        item={item}
                        onRemove={() => handleRemove(item.prd_id)}
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
                      <span>₹{checkoutDetail.subTotal}</span>
                    </div>
                    <div className="list-box d-flex justify-content-between mb-2">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="list-box d-flex justify-content-between mb-2">
                      <span>Discount</span>
                      <span>- ₹{checkoutDetail.discount}</span>
                    </div>
                    <div className="list-box d-flex justify-content-between mb-3">
                      <span>Tax (18%)</span>
                      <span>₹0</span>
                    </div>
                    <hr />
                    <div className="list-box d-flex justify-content-between mb-4">
                      <h5>Total</h5>
                      <h5>₹{checkoutDetail.total}</h5>
                    </div>
                    {/* <button className="btn btn-primary w-100 rounded-0 py-2">
                      PROCEED TO CHECKOUT →
                    </button> */}
                    <Link
                      to={`/checkout/${checkoutUrl}`}
                      className="btn btn-primary w-100 rounded-0 py-2"
                    >
                      PROCEED TO CHECKOUT →
                    </Link>
                  </div>
                  <div className="discount_box">
                    <h5>Have a Coupon?</h5>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Enter coupon code"
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                      />
                      <span
                        className="message_show"
                        style={{ color: couponMessageColor }}
                      >
                        {couponMessage}
                      </span>
                    </div>
                    <button className="btn btn-primary" onClick={applyCoupon}>
                      Apply Coupon
                    </button>
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

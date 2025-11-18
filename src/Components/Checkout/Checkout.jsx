import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { API_URL } from "../../Config/config";
import { PlaceOrderApis } from "./CashPlaceOrderApi";
import AddressModal from "../UserAccount/Addresses/AddressModal";

export default function Checkout() {
  const location = useLocation();
  const { CartData = [], Total = {}, product, quantity } = location.state || {};
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [refreshAddresses, setRefreshAddresses] = useState(false);

  // Coupon states
  const [coupon, setCoupon] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");
  const [couponMessageColor, setCouponMessageColor] = useState("red");

  const token = localStorage.getItem("token");



  // Derived CartData (handle Buy Now or Cart)
  const derivedCartData = product
    ? [
        {
          ...product,
          quantity: quantity || 1,
        },
      ]
    : CartData;
    console.log( "derivedCartData" , derivedCartData)

  // ✅ Calculate total product discount dynamically
  const totalProductDiscount = derivedCartData.reduce((acc, item) => {
    const price = parseFloat(item.price) || 0;
    const discountPrice = parseFloat(item.discount_price) || price;
    const qty = item.quantity || 1;
    return acc + (price - discountPrice) * qty;
  }, 0);

  // Checkout detail state
  const [checkoutDetail, setCheckoutDetail] = useState({
    subTotal:
      Total?.subTotal ||
      derivedCartData.reduce(
        (acc, item) => acc + (item.price || 0) * (item.quantity || 1),
        0
      ),
    productDiscount: totalProductDiscount,
    couponDiscount: 0,
    tax:0,
    total: Total?.total || 0,
  });

  const [finalTotal, setFinalTotal] = useState(
    checkoutDetail.subTotal - checkoutDetail.productDiscount + checkoutDetail.tax
  );

  // Update finalTotal whenever checkoutDetail changes
  useEffect(() => {
    setFinalTotal(
      checkoutDetail.subTotal -
        checkoutDetail.productDiscount -
        checkoutDetail.couponDiscount +
        checkoutDetail.tax
    );
  }, [checkoutDetail]);

  // Load Razorpay script
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => document.body.removeChild(script);
  }, []);

  // Fetch addresses
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/order/get-address`, {
          headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        });
        setAddresses(response.data?.data || []);
        setRefreshAddresses(false);
      } catch (err) {
        console.error("Error fetching addresses:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [token, refreshAddresses]);

  // Apply coupon
  const applyCoupon = async (e) => {
    e.preventDefault();
    if (!coupon) {
      setCouponMessage("Please enter a coupon code!");
      setCouponMessageColor("red");
      return;
    }

    try {
      const productIds = derivedCartData.map((item) => item.id);
      const payload = {
        coupon_code: coupon,
        cart_amount: checkoutDetail.subTotal - checkoutDetail.productDiscount,
        product_ids: productIds,
      };

      const res = await fetch(`${API_URL}/coupons/validate`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (result.status) {
        setIsCouponApplied(true);
        setCouponMessage(result.data.message || "Coupon applied successfully!");
        setCouponMessageColor("green");
        setCheckoutDetail((prev) => ({
          ...prev,
          couponDiscount: result.data.discount,
        }));
      } else {
        setCouponMessage(result?.message || "Invalid Coupon Code!");
        setCouponMessageColor("#fe1e01");
        setIsCouponApplied(false);
      }
    } catch (err) {
      console.error("Coupon API error:", err);
      setCouponMessage("Something went wrong! Try again.");
      setCouponMessageColor("red");
    }
  };

  // Razorpay payment
  const handleOnlinePayment = () => {
    const weblogo = document.querySelector(".header-top")?.dataset?.weblogo || "";
    const userData = JSON.parse(localStorage.getItem("personalDetails") || "{}");

    const options = {
      key: "rzp_live_RCepcGhiyZJNSz",
      amount: finalTotal * 100,
      currency: "INR",
      name: "Every Color",
      image: weblogo,
      handler: async function (response) {
        const payload = {
          first_name: selectedAddress?.name,
          address_id: selectedAddress?.id,
          phone: selectedAddress?.mobile,
          payment_method: "ONLINE",
          platform: "Website",
          order_amount: finalTotal,
          products: derivedCartData.map((item) => ({
            product_id: item?.id,
            customization: item?.customization || null,
            product_quantity: item?.quantity,
            product_name: item?.product_name,
            product_image: item?.product_image,
            product_price: item?.discount_price || item?.price,
            product_variation: item?.variation ? JSON.stringify(item.variation) : null,
          })),
          payment_id: response.razorpay_payment_id,
        };

        try {
          const orderResponse = await PlaceOrderApis(payload);
          if (orderResponse.message === "Order placed successfully") {
            alert("✅ Order Placed Successfully!");
            navigate("/");
          } else {
            alert("❌ Failed to place order");
          }
        } catch (err) {
          console.error("Error placing order:", err);
          alert("❌ Something went wrong");
        }
      },
      prefill: {
        name: userData.fullname || "",
        email: userData.email || "",
        contact: userData.phone || "",
      },
      theme: { color: "#3399cc" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  // Checkout submit
  const submitCheckOut = async (e) => {
    e.preventDefault();
    if (!selectedAddress) {
      alert("⚠️ Please select an address before placing the order!");
      return;
    }

    const payload = {
      first_name: selectedAddress?.name,
      address_id: selectedAddress?.id,
      phone: selectedAddress?.mobile,
      payment_method: paymentMethod === "cod" ? "COD" : "ONLINE",
      platform: "Website",
      order_amount: finalTotal,
      products: derivedCartData.map((item) => ({
        product_id: item?.id,
        customization: item?.customization || null,
        product_quantity: item?.quantity,
        product_name: item?.product_name,
        product_image: item?.product_image,
        product_price: item?.discount_price || item?.price,
        product_variation: item?.variation ? JSON.stringify(item.variation) : null,
      })),
    };

    try {
      if (paymentMethod === "cod") {
        const response = await PlaceOrderApis(payload);
        if (response.message === "Order placed successfully") {
          alert("✅ Order Placed Successfully!");
          navigate("/");
        } else {
          alert("❌ Failed to place order");
        }
      } else {
        handleOnlinePayment();
      }
    } catch (err) {
      console.error("Error placing order:", err);
      alert("❌ Something went wrong");
    }
  };

  // Address modal handlers
  const handleAddAddress = () => {
    setEditAddress(null);
    setShowModal(true);
  };
  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
    setEditAddress(null);
  };
  const handleRefreshAddresses = () => setRefreshAddresses(true);


  const TAX_RATE = 5 // 5%
  // console.log( "tax rate", TAX_RATE)
  useEffect(() => {
  const calculatedTax =
    (checkoutDetail.subTotal - checkoutDetail.productDiscount - checkoutDetail.couponDiscount) *
    TAX_RATE/100;

  setCheckoutDetail((prev) => ({
    ...prev,
    tax: calculatedTax,
  }));
}, [checkoutDetail.subTotal, checkoutDetail.productDiscount, checkoutDetail.couponDiscount]);

  return (
    <div className="container checkout-container my-5">
      <form onSubmit={submitCheckOut}>
        <div className="row justify-content-between">
          {/* Address + Payment Section */}
          <div className="col-md-7">
            <div className="address-box mb-4">
              <h4 className="mb-3">📍 Select Delivery Address</h4>
              {error && <p className="text-danger">{error}</p>}
              {addresses?.length === 0 ? (
                <div className="alert alert-warning">
                  No addresses found. Please add one in your profile.
                </div>
              ) : (
                <div className="row">
                  {addresses.map((addr, idx) => (
                    <div className="col-md-6 mb-3" key={idx}>
                      <div
                        className={`card p-3 h-100 shadow-sm`}
                        onClick={() => setSelectedAddress(addr)}
                        style={{
                          cursor: "pointer",
                          borderWidth: "2px",
                          borderColor: selectedAddress?.id === addr.id ? "#DB3030" : "#ddd",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-start">
                          <label className="form-check-label">
                            <strong>{addr.name}</strong>
                          </label>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditAddress(addr);
                            }}
                          >
                            Edit
                          </button>
                        </div>
                        <hr />
                        <p className="mb-1">{addr.street}</p>
                        <p className="mb-1">
                          {addr.city}, {addr.state} - {addr.zip}
                        </p>
                        <p className="mb-0 text-muted">📞 {addr.mobile}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                type="button"
                className="btn btn-outline-primary mt-2"
                onClick={handleAddAddress}
              >
                ➕ Add New Address
              </button>
            </div>

            {/* Payment Option */}
            <div className="payment-box mt-4">
              <h4 className="mb-3">💳 Payment Option</h4>
              <div className="pay-opt-box">
                <div className={`card p-3 shadow-sm ${!selectedAddress ? "bg-light text-muted" : ""}`}>
                  <div className="d-flex gap-4">
                    <div className="form-check d-flex align-items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        id="cod"
                        value="cod"
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!selectedAddress}
                        className="form-check-input"
                      />
                      <label htmlFor="cod" className="form-check-label ms-2 d-flex align-items-center">
                        <img src="/paypal.png" alt="COD Icon" style={{ width: "40px", marginRight: "10px" }} />
                        Cash on Delivery
                      </label>
                    </div>
                    <div className="form-check d-flex align-items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        id="online"
                        value="online"
                        checked={paymentMethod === "online"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!selectedAddress}
                        className="form-check-input"
                      />
                      <label htmlFor="online" className="form-check-label ms-2 d-flex align-items-center">
                        <img src="/paypal.png" alt="Online Icon" style={{ width: "40px", marginRight: "10px" }} />
                        Online Payment
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-md-4">
            {/* Coupon Box */}
            <div className="discount_box mb-3 mt-4 w-100" style={{ maxWidth: "100%" }}>
              <h5>If You Have a Coupon?</h5>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2"
                  placeholder="Enter coupon code"
                  value={coupon}
                  onChange={(e) => setCoupon(e.target.value)}
                />
                <span className="message_show" style={{ color: couponMessageColor }}>
                  {couponMessage}
                </span>
              </div>
              <button className="btn btn-primary" onClick={applyCoupon}>
                Apply Coupon
              </button>
            </div>

            <div className="order-summary card p-3 shadow-sm">
              <h5 className="mb-3">🛒 Order Summary</h5>
              <ul className="list-unstyled">
                {derivedCartData.map((value, index) => (
                  <li key={index} className="d-flex gap-3 my-2 border-bottom pb-2">
                    <img
                      src={value.product_image}
                      alt={value.product_name}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                    <div>
                      <h6 className="mb-1">{value.product_name}</h6>
                      <p className="mb-0">
                        {value.quantity} × ₹{  value.price}
                      </p>
                    </div>
                    {/* <div>
                      <h6 className="mb-1">{value.product_name}</h6>
                      <p className="mb-0">
                        {value.customization}
                      </p>
                    </div> */}
                  </li>
                ))}
              </ul>

              <table className="table table-sm mt-3">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-end">₹{checkoutDetail.subTotal.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-end">Free</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td className="text-end">- ₹{checkoutDetail.productDiscount.toFixed(2)}</td>
                  </tr>
                  <tr>
                    <td>Coupon</td>
                    <td className="text-end">- ₹{checkoutDetail.couponDiscount.toFixed(2)}</td>
                  </tr>
                  <tr className="fw-bold text-success">
                    <td>Total Discount</td>
                    <td className="text-end">
                      - ₹{(checkoutDetail.productDiscount + checkoutDetail.couponDiscount).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td className="text-end"> (GST {TAX_RATE}%) ₹{checkoutDetail.tax.toFixed(2)}</td>
                  </tr>
                  <tr className="fw-bold border-top">
                    <td>Total</td>
                    <td className="text-end">₹{finalTotal.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <button
                type="submit"
                className="btn btn-success w-100 mt-2"
                style={{ backgroundColor: "#DB3030", borderColor: "#DB3030" }}
                disabled={!selectedAddress}
              >
                PLACE ORDER
              </button>
            </div>
          </div>
        </div>
      </form>

      {/* Address Modal */}
      <AddressModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        token={token}
        editVal={editAddress}
        refreshAddresses={handleRefreshAddresses}
      />
    </div>
  );
}

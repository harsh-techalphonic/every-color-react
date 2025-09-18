import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../Config/config";
import { useLocation } from "react-router-dom";
import { PlaceOrderApis } from "./CashPlaceOrderApi";
import AddressModal from "../UserAccount/Addresses/AddressModal.";

export default function Checkout() {
  const location = useLocation();
  const { CartData, Total } = location.state || {};

  const navigate = useNavigate();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState(null);
  const [products, setProducts] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("cod");

  // State for modal management
  const [showModal, setShowModal] = useState(false);
  const [editAddress, setEditAddress] = useState(null);
  const [refreshAddresses, setRefreshAddresses] = useState(false);

  const token = localStorage.getItem("token");

  // ✅ Fetch Address List
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/order/get-address`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        setAddresses(response.data?.data || []);
        setRefreshAddresses(false); // Reset refresh flag
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    fetchData();
  }, [token, refreshAddresses]); // Add refreshAddresses as dependency

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
      order_amount: Total.total,
      products: CartData.map((item) => ({
        product_id: item?.id,
        product_quantity: item?.quantity,
        product_name: item?.product_name,
        product_image: item?.product_image,
        product_price: item?.variation?.sale_price || item?.product_price,
        product_variation: item?.variation
          ? JSON.stringify(item.variation)
          : null,
      })),
    };

    console.log("🚀 Order Payload:", payload);

    if (paymentMethod === "cod") {
      try {
        const response = await PlaceOrderApis(payload);
        console.log("Order Response:", response);

        if (response.message === "Order placed successfully") {
          alert("✅ Order Placed Successfully!");
          navigate("/home");
        } else {
          alert("❌ Failed to place order");
        }
      } catch (err) {
        console.error("Error placing order:", err);
        alert("❌ Something went wrong");
      }
    } else {
      alert("🌐 Redirecting to Online Payment Gateway...");
      // later: integrate Razorpay / Stripe here
    }
  };

  // Function to handle opening modal for adding new address
  const handleAddAddress = () => {
    setEditAddress(null); // Clear any edit data
    setShowModal(true);
  };

  // Function to handle opening modal for editing address
  const handleEditAddress = (address) => {
    setEditAddress(address);
    setShowModal(true);
  };

  // Function to close modal
  const handleCloseModal = () => {
    setShowModal(false);
    setEditAddress(null);
  };

  // Function to refresh addresses after adding/editing
  const handleRefreshAddresses = () => {
    setRefreshAddresses(true);
  };

  return (
    <div className="container checkout-container my-5">
      <form onSubmit={submitCheckOut} method="POST">
        <div className="row justify-content-between">
          {/* ✅ Address + Payment Section */}
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
                          borderColor:
                            selectedAddress?.id === addr.id
                              ? "#DB3030"
                              : "#ddd",
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
                              e.stopPropagation(); // Prevent selecting the address
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

            {/* ✅ Payment Section */}
            <div className="payment-box mt-4">
              <h4 className="mb-3">💳 Payment Option</h4>
              <div className="pay-opt-box">
                <div
                  className={`card p-3 shadow-sm ${
                    !selectedAddress ? "bg-light text-muted" : ""
                  }`}
                >
                  <div className="d-flex gap-4">
                    <div className="form-check d-flex align-items-center">
                      <input
                        type="radio"
                        name="payment_method"
                        id="cod"
                        value="cod"
                        defaultChecked
                        checked={paymentMethod === "cod"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        disabled={!selectedAddress}
                        className="form-check-input"
                      />
                      <label
                        htmlFor="cod"
                        className="form-check-label ms-2 d-flex align-items-center"
                      >
                        <img
                          src="/paypal.png"
                          alt="COD Icon"
                          style={{ width: "40px", marginRight: "10px" }}
                        />
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
                      <label
                        htmlFor="online"
                        className="form-check-label ms-2 d-flex align-items-center"
                      >
                        <img
                          src="/paypal.png"
                          alt="COD Icon"
                          style={{ width: "40px", marginRight: "10px" }}
                        />
                        Online Payment
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ✅ Order Summary */}
          <div className="col-md-4">
            <div className="order-summary card p-3 shadow-sm">
              <h5 className="mb-3">🛒 Order Summary</h5>
              <div className="summery-product">
                <ul className="list-unstyled">
                  {CartData.map((value, index) => (
                    <li
                      key={index}
                      className="d-flex gap-3 my-2 border-bottom pb-2"
                    >
                      <img
                        src={value.product_image}
                        alt={value.product_name}
                        style={{
                          width: "60px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                      <div>
                        <h6 className="mb-1">{value.product_name}</h6>
                        <p className="mb-0">
                          {value.quantity} ×{" "}
                          <span>
                            ₹
                            {value.variation?.sale_price || value.product_price}
                          </span>
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <table className="table table-sm mt-3">
                <tbody>
                  <tr>
                    <td>Subtotal</td>
                    <td className="text-end">₹{Total?.subTotal}</td>
                  </tr>
                  <tr>
                    <td>Shipping</td>
                    <td className="text-end">Free</td>
                  </tr>
                  <tr>
                    <td>Discount</td>
                    <td className="text-end">- ₹{Total?.discount}</td>
                  </tr>
                  <tr>
                    <td>Tax</td>
                    <td className="text-end">₹{Total?.tax}</td>
                  </tr>
                  <tr className="fw-bold border-top">
                    <td>Total</td>
                    <td className="text-end">₹{Total?.total}</td>
                  </tr>
                </tbody>
              </table>

              <button
                type="submit"
                className="btn btn-success w-100 mt-2 "
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

/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../ReturnRefund/ReturnRefund.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrderApi from "../../../API/OrderApi";
import { Modal, Button, Alert } from "react-bootstrap";
import { sendRefundAndReplaceApi } from "./ApiExportOrBulk";

export default function ReturnRefund() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  // console?.log("selectedProduct --->>", modalType);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [inputReason, setInputReason] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dispatch = useDispatch();
  const orders = useSelector((store) => store.orders.orders);
  console.log("orders", orders)
  const token = localStorage.getItem("token");

  useEffect(() => {
    OrderApi(dispatch, token);
  }, [dispatch]);

  // Get orders array from Redux
  const user = orders.length > 0 ? orders[0].user : null;

  // If no orders yet
  if (!orders || orders.length === 0) {
    return <p className="text-center mt-5">No orders found.</p>;
  }

  const handleShowModal = (type, product, order) => {
    setModalType(type);
    setSelectedProduct(product);
    setSelectedOrder(order);
    setShowModal(true);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleClose = () => {
    setShowModal(false);
    setUploadedImages([]);
    setInputReason("");
    setSelectedReason("");
    setQuantity(1);
    setErrorMessage("");
    setSuccessMessage("");
  };

  const refundReasons = [
    { key: "PRODUCT_NOT_DELIVERED", label: "Product not delivered" },
    {
      key: "CANCELLED_BEFORE_SHIPPING",
      label: "Order cancelled before shipping",
    },
    { key: "DAMAGED_ON_ARRIVAL", label: "Product damaged on arrival" },
    { key: "DEFECTIVE_PRODUCT", label: "Product was defective" },
    { key: "WRONG_ITEM_RECEIVED", label: "Wrong item received" },
    {
      key: "UNAUTHORIZED_TRANSACTION",
      label: "Unauthorized or fraudulent transaction",
    },
    {
      key: "SUBSCRIPTION_CANCELLED",
      label: "Subscription or service cancelled",
    },
    {
      key: "PROMOTION_NOT_APPLIED",
      label: "Discount or promotion not applied",
    },
    { key: "SHIPPING_DELAY", label: "Shipping delayed beyond promised date" },
    { key: "OTHER", label: "Other" },
  ];
  const returnReasons = [
    { key: "DAMAGED", label: "Damaged product received" },
    { key: "DEFECTIVE", label: "Defective or not working" },
    { key: "WRONG_ITEM", label: "Wrong item received" },
    { key: "MISSING", label: "Item missing in package" },
    { key: "SIZE_ISSUE", label: "Size/fit issue" },
    {
      key: "NOT_AS_DESCRIBED",
      label: "Product looks different from description",
    },
    {
      key: "LATE_DELIVERY",
      label: "Received late / after expected delivery date",
    },
    { key: "QUALITY", label: "Quality not satisfactory" },
    { key: "NOT_NEEDED", label: "Changed my mind / no longer needed" },
    { key: "OTHER", label: "Other" },
  ];

  // Validate form inputs
  const validateForm = () => {
    if (!selectedReason) {
      setErrorMessage("Please select a reason");
      return false;
    }

    if (!inputReason.trim()) {
      setErrorMessage("Please provide details about your request");
      return false;
    }

    if (quantity <= 0 || quantity > selectedProduct.product_quantity) {
      setErrorMessage(
        `Quantity must be between 1 and ${selectedProduct.product_quantity}`
      );
      return false;
    }

    if (modalType === "RETURN" && uploadedImages.length === 0) {
      setErrorMessage("Please upload at least one image for return requests");
      return false;
    }

    return true;
  };

  // API call to submit refund/return request
  const submitRequest = async () => {
    console?.log("qwe1w1212");
    try {
      setErrorMessage("");

      // Prepare form data
      const formData = new FormData();
      formData.append("type", modalType == "RETURN" ? "replace" : "refund");
      formData.append("order_id", selectedProduct.order_id);
      formData.append("product_order_id", selectedProduct?.product_id);
      formData.append("reason_code", selectedReason);
      formData.append("reason", inputReason);
      formData.append("quantity", quantity);

      // Append images if any
      uploadedImages.forEach((image, index) => {
        formData.append(`images[]`, image);
      });

      // console.log("formData", formData);
      // Call your API function
      const response = await sendRefundAndReplaceApi(formData);
      // console.log("API Response:", response);

      if (response?.success) {
        setSuccessMessage(
          `Your ${modalType.toLowerCase()} request has been submitted successfully!`
        );
        setTimeout(() => {
          handleClose();
          OrderApi(dispatch, token);
        }, 2000);
      } else {
        setErrorMessage(
          response?.message || "Failed to submit request. Please try again."
        );
      }
    } catch (err) {
      console.error("API Error details:", err);
      setErrorMessage(
        err.message || "An error occurred. Please try again later."
      );
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      submitRequest();
    }
  };

  // Filter orders according to selected status
  const filteredOrders = statusFilter
    ? orders.filter((order) => order.order_status === statusFilter)
    : orders;

  return (
    <div className="orders__box return_refund">
      <div className="row">
        <div className="col-lg-8 ">
          <div className="order-title12 mb-3 d-flex align-items-center justify-content-between">
            <h2>Orders</h2>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-select w-auto"
            >
              <option value="">All Orders</option>
              {[...new Set(orders.map((order) => order.order_status))].map(
                (status, index) => (
                  <option key={index} value={status}>
                    {status.charAt(0).toUpperCase() +
                      status.slice(1).toLowerCase()}
                  </option>
                )
              )}
            </select>
          </div>

          {/* Render only filtered orders */}
          {filteredOrders.map((order) =>
            order.products.map((product) => {
              const variation = product.product_variation
                ? JSON.parse(product.product_variation)
                : null;
                    // {console.log("first product", product)}
              return (
                <div
                  key={product.id}
                  className="order-box-one d-flex align-items-center gap-4 mb-3"
                >
                  {/* Product Image */}
                  <div className="order-box-img">
                    <img
                      src={product.product_image}
                      alt={product.product_name}
                    />
                  </div>

                  {/* Product Details */}
                  <div className="order-box_content">
                    <p className="bold">{product.product_name}</p>
                    <p className="pricing">
                      ₹{order.order_amount} /{" "}
                      <span>{order.payment_method}</span>{" "}
                    </p>
                    <p className="orderID">
                      <b>Delivered on :</b>{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="orderID">
                      <b>Status :</b> {order.order_status}
                    </p>
                    <p className="orderID">
                      <b>Order ID :</b> {order.id}
                    </p>
                    <p className="orderID">
                      <b>Quantity :</b> {product.product_quantity}
                    </p>

                    {variation && (
                      <p className="orderID">
                        <b>Variation :</b> {variation.color} | {variation.size}
                      </p>
                    )}
                  </div>

                  {order?.order_status === "delivered" && (
                    <div className="Rerun_ref_btn">
                      <button
                        className="RETURN mb-4"
                        onClick={() =>
                          handleShowModal("RETURN", product, order)
                        }
                      >
                        RETURN
                      </button>
                      <button
                        className="Refund"
                        onClick={() =>
                          handleShowModal("REFUND", product, order)
                        }
                      >
                        Refund
                      </button>
                    </div>
                  )}

                  {order?.order_status === "pending" && (
                    <div className="Rerun_ref_btn">
                      <button
                        className="RETURN mb-4"
                        onClick={() =>
                          handleShowModal("RETURN", product, order)
                        }
                      >
                              Track Order
                      </button>
                      <button
                        className="Refund"
                        onClick={() =>
                          handleShowModal("REFUND", product, order)
                        }
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {order?.order_status === "shipped" && (
                    <div className="Rerun_ref_btn">
                      <button
                        className="RETURN mb-4"
                        onClick={() =>
                          handleShowModal("RETURN", product, order)
                        }
                      >
                        Track Order
                      </button>
                     
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Right-side summary */}
        <div className="col-lg-4">
          <div className="container">
            <div className="card bg-light p-3">
              <h6>Order# (1 item)</h6>
              <Link to="#" className="text-primary">
                Order placed on 11th September 2024
              </Link>
              <p className="text-muted">Paid by Cash in Delivery</p>
            </div>

            <div className="card mt-3 p-3 ">
              <h5 className="fw-bold">Order Payment Details</h5>
              <div className="d-flex justify-content-between">
                <span>Order Amount</span>
                <span>&#8377;909.50</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Order Saving</span>
                <span>&#8377;909</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Coupon Savings</span>
                <span>&#8377;909</span>
              </div>
              <div className="d-flex justify-content-between">
                <span>Convenience Fee</span>
                <span>&#8377;909</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Order Total</span>
                <span>&#8377;90966.50</span>
              </div>
              <h6 className="mt-3 fw-bold">Payment Mode</h6>
              <p>
                Cash On Delivery{" "}
                <span className="fw-bold float-end">&#8377;90966.50</span>
              </p>
            </div>

            <div className="card mt-3 p-3">
              <h5 className="fw-bold">Deliver to</h5>
              <p className="mb-1">
                <strong>{user?.name}</strong>{" "}
                <span className="badge bg-secondary">HOME</span>
              </p>
              <p className="mb-1">203, C Block, Sector 63, Noida,</p>
              <p className="mb-1">Hazratpur Wajidpur,</p>
              <p className="mb-1">Uttar Pradesh 201301</p>
              <p>
                <strong>Phone :</strong> {user?.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{modalType} Request</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {successMessage && (
              <Alert variant="success">{successMessage}</Alert>
            )}

            {selectedProduct && (
              <>
                <p>
                  <b>Product:</b> {selectedProduct.product_name}
                </p>
                <p>
                  <b>Price:</b> ₹{selectedProduct.product_price}
                </p>
                <p>
                  <b>Available Quantity:</b> {selectedProduct.product_quantity}
                </p>
              </>
            )}

            {/* Image Upload - Only for returns */}
            {modalType  && (
              <div className="mb-3">
                <label className="form-label">
                  Upload Images (required for returns)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="form-control"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setUploadedImages((prev) => [...prev, ...files]);
                    e.target.value = "";
                  }}
                />
              </div>
            )}

            <div className="d-flex flex-wrap gap-2">
              {uploadedImages.map((file, index) => (
                <div key={index} style={{ position: "relative" }}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`preview-${index}`}
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      borderRadius: "5px",
                      border: "1px solid #ccc",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setUploadedImages((prev) =>
                        prev.filter((_, i) => i !== index)
                      )
                    }
                    style={{
                      position: "absolute",
                      top: "-5px",
                      right: "-5px",
                      backgroundColor: "red",
                      color: "white",
                      border: "none",
                      borderRadius: "50%",
                      width: "25px",
                      height: "25px",
                      cursor: "pointer",
                    }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>

            {/* Reason Dropdown */}
            <div className="mb-3">
              <label className="form-label">Select {modalType} Reason</label>
              <select
                className="form-control"
                value={selectedReason}
                onChange={(e) => setSelectedReason(e.target.value)}
              >
                <option value="">-- Select Reason --</option>
                {(modalType === "REFUND" ? refundReasons : returnReasons).map(
                  (reason) => (
                    <option key={reason.key} value={reason.key}>
                      {reason.label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Reason Details</label>
              <textarea
                className="form-control"
                placeholder="Please provide details about your request"
                value={inputReason}
                onChange={(e) => setInputReason(e.target.value)}
                rows={3}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Quantity</label>
              <input
                type="number"
                className="form-control"
                placeholder="Enter quantity"
                min="1"
                max={selectedProduct ? selectedProduct.product_quantity : 1}
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleConfirm}
              disabled={!!successMessage}
            >
              Confirm {modalType}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}

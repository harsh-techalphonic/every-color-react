/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import "../ReturnRefund/ReturnRefund.css";

import { useDispatch, useSelector } from "react-redux";
import OrderApi from "../../../API/OrderApi";
import { Modal, Button, Alert } from "react-bootstrap";
import { sendRefundAndReplaceApi } from "./ApiExportOrBulk";
import { useNavigate } from "react-router-dom";

export default function ReturnRefund() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedReason, setSelectedReason] = useState("");
  const [inputReason, setInputReason] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Cancel Modal States
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [cancelError, setCancelError] = useState("");
  const [cancelSuccess, setCancelSuccess] = useState("");

  // Track expanded orders
  const [expandedOrders, setExpandedOrders] = useState({});

  const dispatch = useDispatch();
  const orders = useSelector((store) => store.orders.orders);
  const token = localStorage.getItem("token");

  useEffect(() => {
    OrderApi(dispatch, token);
  }, [dispatch]);

  if (!orders || orders.length === 0) {
    return <p className="text-center mt-5">No orders found.</p>;
  }

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

  // Refund / Return Modal Handlers
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

  // Cancel Modal Handlers
  const handleShowCancelModal = (order,product) => {
    setSelectedOrder(order);
    setSelectedProduct(product);
    setCancelReason("");
    setCancelError("");
    setCancelSuccess("");
    setShowCancelModal(true);
  };

  const handleCloseCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason("");
    setCancelError("");
    setCancelSuccess("");
  };

  // Cancel Order API
  const cancelOrderApi = async () => {
    if (!cancelReason.trim()) {
      setCancelError("Please enter a reason for cancellation");
      return;
    }
    try {
      setCancelError("");
      const formData = new FormData();
      formData.append("order_id", selectedOrder.shiprocket_order_id);
      formData.append("product_id", selectedProduct.product_id);
      formData.append("reason", cancelReason);

      const response = await fetch(
        "https://dhanbet9.co/api/order/cancel-order",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: formData,
        }
      );

      const result = await response.json();
      if (result?.success) {
        setCancelSuccess("Order cancelled successfully!");
        setTimeout(() => {
          handleCloseCancelModal();
          OrderApi(dispatch, token);
        }, 2000);
      } else {
        setCancelError(result?.message || "Failed to cancel order");
      }
    } catch (err) {
      setCancelError(err.message || "Error while cancelling order");
    }
  };

  // Validate form inputs (Refund / Return)
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

  const submitRequest = async () => {
    try {
      setErrorMessage("");
      const formData = new FormData();
      formData.append("type", modalType === "RETURN" ? "replace" : "refund");
      formData.append("order_id", selectedProduct.order_id);
      formData.append("product_order_id", selectedProduct?.product_id);
      formData.append("reason_code", selectedReason);
      formData.append("reason", inputReason);
      formData.append("quantity", quantity);
      uploadedImages.forEach((image) => {
        formData.append(`images[]`, image);
      });
      const response = await sendRefundAndReplaceApi(formData);
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
      setErrorMessage(err.message || "An error occurred. Please try again.");
    }
  };

  const handleConfirm = () => {
    if (validateForm()) {
      submitRequest();
    }
  };

  // Filter Orders
  const filteredOrders = statusFilter
    ? orders.filter((order) => order.order_status === statusFilter)
    : orders;

  // inside your toggleExpand function
  const toggleExpand = (orderId) => {
    setExpandedOrders((prev) => {
      // If clicking the same order, toggle it
      if (prev[orderId]) {
        return {};
      }
      // Open only the clicked order, close others
      return { [orderId]: true };
    });
  };
  // const shipmentId = filteredOrders.shiprocket_shipment_id
  const downloadInvoice = async (shipmentId) => {
    try {
      if (!shipmentId) throw new Error("Shipment ID not found");

      const formData = new FormData();
      formData.append("ids", `[${shipmentId}]`); 

      const response = await fetch("https://dhanbet9.co/api/download-invoice", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      

      const data = await response.json();

      if (data?.invoice_url) {
        window.open(data.invoice_url, "_blank");
      } else {
        throw new Error("Invoice URL not found in response");
      }
    } catch (err) {
      alert(err.message || "Error downloading invoice");
    }
  };


  const handleTrackOrder = async (order) => {
    try {
      const shipmentId = order.shiprocket_shipment_id ;
      if (!shipmentId) throw new Error("Shipment ID or AWB not found");

      const url = order.shiprocket_shipment_id 
    ? `https://dhanbet9.co/api/track-order?shipment_id=${order.shiprocket_shipment_id}` 
    : `https://dhanbet9.co/api/track-order?awb=${order.shiprocket_awb}`;
    console.log("track url", url)

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to TrackOrderDetail page with data
        navigate("/track-order-detail", { state: { trackingData: data } });
      } else {
        alert(data.message || "Failed to fetch tracking details");
      }
    } catch (err) {
      alert(err.message || "Error while tracking order");
    }
  };

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


          {/* Render Orders */}
          {filteredOrders.map((order) => (
            <div key={order.id} className={`order-box mb-4 ${
    expandedOrders[order.id] ? "border rounded p-3" : ""
  }`}>
              <div
                className="order-summary d-flex justify-content-between align-items-center p-3 border rounded"
                style={{ cursor: "default" }} // removed pointer here
              >
                <div>
                  <p>
                    <b>Order ID:</b> {order.id}{" "}
                  </p>
                  {/* <p><b>Order ID:</b> {order.shiprocket_shipment_id} </p> */}
                  <p>
                    <b>Status:</b> {order.order_status}
                  </p>
                  <p>
                    <b>Amount:</b> ₹{order.order_amount}
                  </p>
                  <p>
                    <b>Date:</b>{" "}
                    {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>

                <div className="d-flex flex-column Rerun_ref_btn align-items-end gap-2">
                  {/* Toggle button ONLY here */}
                  <button
                    className="btn Refund "
                    onClick={() => toggleExpand(order.id)}
                  >
                    {expandedOrders[order.id]
                      ? "▲ Hide Products"
                      : "▼ View Products"}
                  </button>

                  <button
                    className="btn RETURN"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadInvoice(order.shiprocket_order_id);
                    }}
                  >
                    Download Invoice
                  </button>
                </div>
              </div>

              {/* Products inside the order */}
              {expandedOrders[order.id] && (
                <div className="mt-3">
                  {order.products.map((product) => {
                    const variation = product.product_variation
                      ? JSON.parse(product.product_variation)
                      : null;
                    return (
                      <div
                        key={product.id}
                        className="order-box-one d-flex align-items-center gap-4 mb-3 border p-2 rounded"
                      >
                        <div className="order-box-img">
                          <img
                            src={product.product_image}
                            alt={product.product_name}
                          />
                        </div>

                        <div className="order-box_content">
                          <p className="bold">{product.product_name}</p>
                          <p className="pricing">
                            ₹{product.product_price} ×{" "}
                            {product.product_quantity}
                          </p>
                          {variation && (
                            <p className="orderID">
                              <b>Variation:</b> {variation.color} |{" "}
                              {variation.size}
                            </p>
                          )}
                        </div>

                        {order?.order_status === "delivered" && (
                          <div className="Rerun_ref_btn">
                            <button
                              className="RETURN mb-2"
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
                              REFUND
                            </button>
                          </div>
                        )}

                        {order?.order_status === "pending" && (
                          <div className="Rerun_ref_btn">
                            <button className="RETURN mb-2" onClick={() => handleTrackOrder(order)}>Track Order</button>
                            <button
                              className="Refund"
                              onClick={() => handleShowCancelModal(order, product)}
                            >
                              CANCEL
                            </button>
                          </div>
                        )}

                        {order?.order_status === "shipped" && (
                          <div className="Rerun_ref_btn">
                            <button className="RETURN mb-2" onClick={() => handleTrackOrder(order)}>Track Order</button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Cancel Modal */}
        <Modal show={showCancelModal} onHide={handleCloseCancelModal}>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Order</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {cancelError && <Alert variant="danger">{cancelError}</Alert>}
            {cancelSuccess && <Alert variant="success">{cancelSuccess}</Alert>}

            {selectedOrder && selectedProduct && (
              <div className="d-flex gap-3 ">
                <div className="trackorder-img ">
                  <img src={selectedProduct.product_image} alt={selectedProduct.product_name} />
                </div>
                <div>
                  <p>
                    <b>Product Name:</b> {selectedProduct.product_name}
                  </p>
                  <p>
                    <b>Order ID:</b> {selectedOrder.shiprocket_order_id}
                  </p>
                  <p>
                    <b>Product ID:</b> {selectedProduct.product_id}
                  </p>

                </div>

              </div>
            )}
            <div className="mb-3">
              <label className="form-label">Reason for cancellation</label>
              <textarea
                className="form-control"
                rows={3}
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseCancelModal}>
              Close
            </Button>
            <Button variant="danger" onClick={cancelOrderApi}>
              Confirm Cancel
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Refund/Return Modal */}
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
            {modalType === "RETURN" && (
              <div className="mb-3">
                <label className="form-label">Upload Images</label>
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

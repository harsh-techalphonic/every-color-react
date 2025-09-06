import React, { useEffect } from "react";
import "../ReturnRefund/ReturnRefund.css";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import OrderApi from "../../../API/OrderApi";

export default function ReturnRefund() {
  const dispatch = useDispatch();

  const token = localStorage.getItem("token");

    console?.log('localStorage.getItem("token") ------>>>>>',token)
  useEffect(() => {
    console?.log('localStorage.getItem("token") ------>>>>>',token)
    OrderApi(dispatch, token);
  }, [dispatch]);

  // Get orders array from Redux
  const orders = useSelector((store) => store.orders.orders);
  const user = orders.length > 0 ? orders[0].user : null;

  console.log("orders details", orders);
  console.log("user details", user);

  // If no orders yet
  if (!orders || orders.length === 0) {
    return <p className="text-center mt-5">No orders found.</p>;
  }

  return (
    <div className="orders__box return_refund">
      <div className="row">
        <div className="col-lg-7">
          {orders.map((order) =>
            order.products.map((product) => {
              const variation = product.product_variation
                ? JSON.parse(product.product_variation)
                : null;

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
                      ₹{product.product_price} /{" "}
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

                    {/* Variation details if available */}
                    {variation && (
                      <p className="orderID">
                        <b>Variation :</b> {variation.color} | {variation.size}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="Rerun_ref_btn">
                    <button className="RETURN mb-4">RETURN</button>
                    <button className="Refund">Refund</button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="col-lg-5">
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
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import "./ReturnRefund.css";
import { useDispatch } from "react-redux";
import OrderApi from "../../../API/OrderApi";
import { getRefundAndReturnList } from "../../../API/AllApiCode";

export default function ReturnRefund() {
  const [refundRetunDta, setRefundRetunDta] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("");
  const dispatch = useDispatch();
  useEffect(() => {
    OrderApi(dispatch);
  }, [dispatch]);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const getData = await getRefundAndReturnList();
        if (getData && getData.data) {
          setRefundRetunDta(getData.data);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    getUserProfile();
  }, []);

  if (!refundRetunDta || refundRetunDta.length === 0) {
    return <p className="text-center mt-5">No orders found.</p>;
  }

  // Create unique order statuses
  const statuses = Array.from(new Set(refundRetunDta.map(order => order.status)));

  // Filter orders based on selected status
  const filteredOrders = selectedStatus
    ? refundRetunDta.filter(order => order.status === selectedStatus)
    : refundRetunDta;



    console.log("data out put" ,refundRetunDta)

  return (
    <div className="orders__box return_refund">
      <div className="row">
        <div className="col-lg-7 p-3">
          <div className="order-title12 mb-3 d-flex align-items-center justify-content-between">
            <h2>Replace/Refund</h2>
            <select
              className="form-select w-auto"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">All Orders</option>
              {statuses.map((status, index) => (
                <option key={index} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1).toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          {filteredOrders.map((order) =>
            order.products.map((product) => {
              const variation = product.product_variation
                ? JSON.parse(product.product_variation)
                : null;
              return (
                <div
                  key={product.id}
                  className="order-box-one d-flex align-items-center gap-4 mb-3"
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
                      ₹{product.product_price} / <span>{order.payment_method}</span>{" "}
                    </p>
                    <p className="orderID">
                      <b>Delivered on :</b>{" "}
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                    <p className="orderID">
                      <b>Status :</b> {order.status}/<b style={{textTransform:'capitalize'}}>{order?.type}</b>
                    </p>
                    <p className="orderID">
                      <b>Order ID :</b> {order?.order?.shiprocket_order_id}
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
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

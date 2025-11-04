import React, { useState } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTruck,
  faBox,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Footer from "../../Components/Partials/Footer/Footer";
import Header from "../../Components/Partials/Header/Header";
import { useLocation, useNavigate } from "react-router-dom";

const TrackingCard = () => {



    const location = useLocation();
  const navigate = useNavigate();

  const order = location.state?.trackingData?.order;

  if (!order) {
    navigate('/track-order');
    return null;
  }
  console.log("trackingData", order)




  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

 

  // const order = {
  //   orderId: "787706614",
  //   placedDate: "October 19, 2023",
  //   price: "$11.94",
  //   courier: "FedEx",
  //   estimatedArrival: "Tomorrow",
  //   customer: {
  //     name: "John Newman",
  //     phone: "(415) 315-9111",
  //     address: "123 Main Street, New York, NY",
  //   },
  //   statusSteps: ["Order Received", "Shipped", "Delivered"],
  //   currentStep: 1,
  //   steps: [
  //     {
  //       title: "Order Received",
  //       date: "Oct 19, 2023",
  //       sub: "We have received your order",
  //       status: "done",
  //     },
  //     {
  //       title: "Preparing Your Order",
  //       date: "Oct 19, 2023",
  //       sub: "",
  //       status: "done",
  //     },
  //     {
  //       title: "Shipped",
  //       date: "Oct 19, 2023",
  //       sub: "Via FedEx • Tracking No. 654259643660",
  //       status: "done",
  //       inner: [
  //         {
  //           title: "In Transit",
  //           sub: "MOUNT JULIET, TN",
  //           date: "Oct 19, 2023 at 12:00 AM",
  //           status: "done",
  //         },
  //         {
  //           title: "Shipment Acknowledged",
  //           sub: "NO_DATA, NO_DATA",
  //           date: "Oct 19, 2023 at 05:34 PM",
  //           status: "done",
  //         },
  //         {
  //           title: "Arrived at Terminal",
  //           sub: "MOUNT JULIET, TN",
  //           date: "Oct 19, 2023 at 07:18 PM",
  //           status: "done",
  //         },
  //         {
  //           title: "In Transit",
  //           sub: "MOUNT JULIET, TN",
  //           date: "Oct 19, 2023 at 10:14 PM",
  //           status: "done",
  //         },
  //         {
  //           title: "Arrived at Terminal",
  //           sub: "MURFREESBORO, TN",
  //           date: "Oct 19, 2023 at 11:53 PM",
  //           status: "done",
  //         },
  //         {
  //           title: "Departed Terminal",
  //           sub: "MURFREESBORO, TN",
  //           date: "Oct 20, 2023 at 01:34 AM",
  //           status: "done",
  //         },
  //       ],
  //     },
  //     {
  //       title: "Delivered",
  //       date: "",
  //       sub: "Package delivered to customer",
  //       status: "upcoming",
  //     },
  //   ],
  // };

  const renderStep = (step, index, isInner = false) => (
    <div
      key={index}
      className={`mb-4 position-relative ${isInner ? "ps-4" : ""}`}
    >
      {/* Connector Line */}
      {!isInner && index < order.steps.length - 1 && (
        <div
          className="position-absolute top-0 start-0 translate-middle-x"
          style={{
            width: "2px",
            height: "calc(100% + 4px)",
            background: step.status === "done" ? "#0d6efd" : "#d9d9d9",
            marginLeft: "7px",
            marginTop: "24px",
            zIndex: 0,
          }}
        />
      )}

      {/* Circle */}
      <div
        className="rounded-circle position-absolute d-flex align-items-center justify-content-center"
        style={{
          width: "22px",
          height: "22px",
          left: isInner ? "10px" : "-3px",
          top: "2px",
          background: step.status === "done" ? "#0d6efd" : "#e9ecef",
          border:
            step.status === "done" ? "2px solid #0d6efd" : "2px solid #ccc",
          color: step.status === "done" ? "white" : "#999",
          fontSize: "12px",
          zIndex: 1,
        }}
      >
        {step.status === "done" ? "✓" : ""}
      </div>

      {/* Step Content */}
      <div className="ms-4">
        <h6
          className={`mb-1 fw-bold ${
            step.status !== "done" ? "text-muted" : ""
          }`}
        >
          {step.title}
        </h6>
        {step.sub && (
          <p
            className="mb-0 small text-muted"
            style={{ whiteSpace: "pre-line" }}
          >
            {step.sub}
          </p>
        )}
        {step.date && <p className="text-muted small mb-0">{step.date}</p>}

        {/* Inner Steps */}
        <div className="mt-4">

        {step.inner &&
          step.inner.map((innerStep, idx) => renderStep(innerStep, idx, true))}
          </div>
      </div>
    </div>
  );

  return (
    <>
      <Header />
      <div className="container my-5">
        {/* Order Header */}
        <div className="mb-3">
          <h4>Order #{order.orderId}</h4>
          <p className="text-muted">
            Placed {order.placedDate} | {order.price}
          </p>
        </div>

        {/* Status Info Banner */}
        <div className="alert alert-info d-flex gap-3 flex-lg-nowrap flex-wrap justify-content-between align-items-center">
          <span>
            <strong>Order Status Updates</strong> - Click the status button to
            check more tracking details and stay updated every step of the way.
          </span>
          <Button
            variant="primary"
            className="align-self-start text-nowrap"
            onClick={handleShow}
          >
            Track Status
          </Button>
        </div>

        {/* Tracking Summary Card */}
        <div className="card shadow-sm p-4">
          <div className="row">
            {/* Left Section */}
            <div className="col-md-8 mb-3">
              <h5>
                {order.statusSteps[order.currentStep]}
                <span className="ms-2 text-muted small">
                  Via {order.courier}
                </span>
              </h5>
              <p className="mb-1">
                <FontAwesomeIcon icon={faTruck} className="me-2 text-success" />
                Estimated Arrival <strong>{order.estimatedArrival}</strong>
              </p>

              {/* Progress Tracker */}
              <div className="position-relative mt-4">
                {/* Progress Line */}
                <div className="progress" style={{ height: "6px" }}>
                  <div
                    className="progress-bar bg-primary"
                    role="progressbar"
                    style={{
                      width: `${
                        (order.currentStep / (order.statusSteps.length - 1)) *
                        100
                      }%`,
                    }}
                  />
                </div>

                {/* Step Circles */}
                <div className="d-flex justify-content-between position-absolute top-50 start-0 w-100 translate-middle-y">
                  {order.statusSteps.map((step, index) => (
                    <div
                      key={index}
                      className={`rounded-circle d-flex align-items-center justify-content-center ${
                        index <= order.currentStep -1
                          ? "bg-primary text-white"
                          : "bg-light border"
                      }`}
                      style={{ width: "35px", height: "35px" }}
                    >
                      {index === 0 && <FontAwesomeIcon icon={faBox} />}
                      {index === 1 && <FontAwesomeIcon icon={faTruck} />}
                      {index === 2 && <FontAwesomeIcon icon={faCheckCircle} />}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Labels */}
              <div className="d-flex justify-content-between mt-3">
                {order.statusSteps.map((step, index) => (
                  <small
                    key={index}
                    className={
                      index <= order.currentStep ? "fw-bold" : "text-muted"
                    }
                  >
                    {step}
                  </small>
                ))}
              </div>
            </div>

            {/* Right Section */}
            <div className="col-md-4  mb-3 d-flex flex-column justify-content-between">
              <div>
                <h6>Deliver To</h6>
                <p className="mb-1">{order.customer.name}</p>
                <p className="mb-1">{order.customer.address}</p>
                <p className="mb-0">{order.customer.phone}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Offcanvas Right (Track Package Details) */}
      <Offcanvas
        show={show}
        onHide={handleClose}
        placement="end"
        backdrop={true}
      >
        <Offcanvas.Header closeButton className="border-bottom">
          <Offcanvas.Title>Order Tracking</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body className="bg-light">
          <div className="mb-3">
            <h5 className="mb-1">Order #{order.orderId}</h5>
            <p className="text-muted mb-0">
              Placed {order.placedDate} | {order.price}
            </p>
          </div>

          {/* Timeline */}
          <div className="position-relative ps-4"> 
            {order.steps.map((step, index) => renderStep(step, index))}
          </div>

          {/* Delivery Details */}
          <div className="card border-0 shadow-sm p-3 mt-4">
            <h6>Deliver To</h6>
            <p className="mb-1">{order.customer.name}</p>
            <p className="mb-1">{order.customer.address}</p>
            <p className="mb-0">{order.customer.phone}</p>
          </div>
        </Offcanvas.Body>
      </Offcanvas>

      <Footer />
    </>
  );
};

export default TrackingCard;

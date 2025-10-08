import React, { useState } from 'react';
import ScrollToTop from '../ScrollToTop';
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import axios from 'axios';
import config from "../../Config/config.json";
import { useNavigate } from 'react-router-dom';

export default function TrackOrder() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({ status: null, message: "" });

  const [formData, setFormData] = useState({
    shipment_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setApiResponse({ status: null, message: "" });

    try {
      // Send shipment_id as query param
      const response = await axios.get(`${config.API_URL}/track-order`, {
        params: { shipment_id: formData.shipment_id },
        headers: { "Content-Type": "application/json" },
      });

      console.log("API Response:", response.data);

      const data = response.data;

      // ✅ If success is true → redirect to tracking details page
      if (data.status === true) {
        navigate('/track-order-detail', { state: { trackingData: data } });
        setFormData({ shipment_id: "" });
      } else {
        setApiResponse({
          status: true,
          message: data.message || "Order not found!",
        });
      }
    } catch (err) {
      console.error("API Error:", err.response?.data || err.message);
      setApiResponse({
        status: false,
        message: err.response?.data.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Header />

      <section className="login-sec bulk_order my-5">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
              <div className="login-box shadow p-4 rounded">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4 text-center">Track Your Order</h2>

                  {/* API Response Message */}
                  {apiResponse.message && (
                    <div
                      className={`alert ${
                        apiResponse.status ? "text-success" : "text-danger"
                      } text-center`}
                    >
                      {apiResponse.message}
                    </div>
                  )}

                  {/* Order Id Input */}
                  <div className="mb-3">
                    <label htmlFor="shipment_id" className="form-label fw-semibold">
                      Order ID
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="shipment_id"
                      name="shipment_id"
                      placeholder="Enter your Order ID"
                      value={formData.shipment_id}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <button
                    className="btn btn-primary w-100"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        Searching...
                      </>
                    ) : (
                      "Track Order"
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

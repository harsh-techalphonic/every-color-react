import React, { useState } from 'react'
import ScrollToTop from '../ScrollToTop';
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import axios from 'axios';
import config from "../../Config/config.json";

export default function TrackOrder() {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({ status: null, message: "" });

  const [formData, setFormData] = useState({
    order_id: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${config.API_URL}/web/export-order`,
        formData
      );

      console.log("API Response:", response.data);

      setApiResponse({
        status: response.data.status,
        message: response.data.message,
      });

      setFormData({
        order_id: ""
      });
    } catch (err) {
      if (err.response) {
        console.error("Validation Errors:", err.response.data);
        setApiResponse({
          status: false,
          message: err.response.data.message || "Something went wrong!",
        });
      } else {
        console.error("API Error:", err.message);
        setApiResponse({
          status: false,
          message: err.message,
        });
      }
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
              <div className="login-box">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Track Order</h2>

                  {/* API Response Message */}
                  {apiResponse.message && (
                    <p
                      style={{
                        color: apiResponse.status ? "green" : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {apiResponse.message}
                    </p>
                  )}

                  {/* Company Name */}
                  <div className="mb-3">
                    <label htmlFor="order_id" className="form-label">
                       Order Id
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="order_id"
                      name="order_id"
                      placeholder="Enter Order Id"
                      value={formData.order_id}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  
                  <button
                    className="form-control btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Searching..." : "Track Order"}
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


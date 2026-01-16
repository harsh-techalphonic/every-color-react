import React, { useState } from "react";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import ScrollToTop from "../ScrollToTop";
import config from "../../Config/config.json";
import axios from "axios";
import exportimg from "../../../public/export.jpg";
import HelmetComponent from "../../Components/HelmetComponent/HelmetComponent";
import logo from '../../assets/EveryColourLogo.png'

export default function BulkOrder({ onHeaderHeight }) {
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState({ status: null, message: "" });

  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    number: "",
    email: "",
    description: "",
    order_type: "bulk",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      const onlyDigits = value.replace(/\D/g, "").slice(0, 10);
      setFormData({ ...formData, [name]: onlyDigits });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        `${config.API_URL}/web/export-order`,
        formData
      );

    

      setApiResponse({
        status: response.data.status,
        message: response.data.message,
      });

      setFormData({
        company_name: "",
        contact_person: "",
        number: "",
        email: "",
        order_type: "bulk",
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
      <HelmetComponent
                    title="Bulk Order Online | Wholesale Pricing & Large Quantity Purchases"
                    description="Place bulk orders easily with our wholesale solutions. Get the best deals on large quantity purchases, secure packaging, and doorstep delivery at competitive prices."
                    keywords="bulk order, wholesale purchase, bulk buying India, large quantity order, wholesale deals, bulk pricing, order in bulk online, wholesale suppliers"
                    image={logo}
                  />
      <Header onHeight={onHeaderHeight} />

      <section className="login-sec bulk_order">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-7 col-lg-6 col-md-12">
              <div className="img_box">
                <img src={exportimg} alt="Export" />
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-4">
              <div className="login-box">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Bulk Order Inquiry</h2>
                  <p>Submit your bulk order details below, and our team will contact you with the best pricing and delivery options.</p>

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
                    <label htmlFor="company_name" className="form-label">
                      Company Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="company_name"
                      name="company_name"
                      placeholder="Enter company name"
                      value={formData.company_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Contact Person */}
                  <div className="mb-3">
                    <label htmlFor="contact_person" className="form-label">
                      Contact Person
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="contact_person"
                      name="contact_person"
                      placeholder="Enter contact person"
                      value={formData.contact_person}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {/* Phone Number */}
                  <div className="mb-3">
                    <label htmlFor="number" className="form-label">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      className="form-control"
                      id="number"
                      name="number"
                      placeholder="Enter phone number"
                      value={formData.number}
                      onChange={handleChange}
                      required
                      maxLength="10"
                    />
                  </div>

                  {/* Email */}
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      placeholder="Enter email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="description" className="form-label">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      placeholder="Enter description"
                      value={formData.description}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>

                  {/* Hidden Order Type */}
                  <input
                    type="hidden"
                    id="order_type"
                    name="order_type"
                    value={formData.order_type}
                  />

                  <button
                    className="form-control btn"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? "Submitting..." : "Submit "}
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

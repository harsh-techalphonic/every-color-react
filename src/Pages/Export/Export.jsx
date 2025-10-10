import React, { useState } from "react";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import ScrollToTop from "../ScrollToTop";
import config from "../../Config/config.json";
import axios from "axios";
import exportimg from "../../../public/export.jpg";
import HelmetComponent from "../../Components/HelmetComponent/HelmetComponent";
import logo from '../../assets/EveryColourLogo.png'

export default function Export() {
  const [loading, setLoading] = useState(false);

  // ✅ Bulk Order form data (snake_case keys to match backend)
  const [formData, setFormData] = useState({
    company_name: "",
    contact_person: "",
    number: "",
    email: "",
    country: "",
    description: "",
    order_type: "export",
  });

  // Generic input handler
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "number") {
      // allow only digits and max 10 chars for phone
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
      // console.log("Submitting Bulk Order:", formData);

      // ✅ API call
      const response = await axios.post(
        `${config.API_URL}/web/export-order`,
        formData
      );

      // console.log("API Response:", response.data);

      alert("Bulk order submitted successfully!");
      setFormData({
        company_name: "",
        contact_person: "",
        number: "",
        email: "",
        country: "",
        order_type: "export",
      });
    } catch (err) {
      if (err.response) {
        console.error("Validation Errors:", err.response.data);
        alert("Error: " + JSON.stringify(err.response.data));
      } else {
        console.error("API Error:", err.message);
        alert("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <HelmetComponent
              title="Export Inquiry Form | Bulk Orders, Global Shipping & Pricing Solutions"
              description="Submit your export inquiry today! Connect with our experts for bulk orders, international shipping, and competitive pricing. Grow your business worldwide with our easy export solutions."
              keywords="export inquiry form, bulk order export, international shipping solutions, export business India, wholesale export inquiry, export pricing, global trade solutions, export contact form, export company India"
              image={logo}
            />
      <Header />

      <section className="login-sec bulk_order">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-7 col-lg-6 col-md-12">
              <div className="img_box">
                <img src={exportimg} alt="" />
              </div>
            </div>
            <div className="col-xl-5 col-lg-6 col-md-12 col-12 my-5">
              <div className="login-box">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Export Inquiry Form</h2>
                  <p className="mb-4">
                    Grow your business worldwide with our easy export solutions. Fill the form and our experts will contact you for bulk orders, shipping, and pricing.
                  </p>

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

                  {/* Country */}
                  <div className="mb-3">
                    <label htmlFor="country" className="form-label">
                      Country
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="country"
                      name="country"
                      placeholder="Country"
                      value={formData.country}
                      onChange={handleChange}
                      required
                    />
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
                    {loading ? "Submitting..." : "Submit Bulk Order"}
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

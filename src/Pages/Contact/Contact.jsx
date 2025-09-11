import React, { useState } from "react";
import "./Contact.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import { Link } from "react-router-dom";
import ContactApi from "../../API/ContactApi";
import config from "../../Config/config.json";

import { useSelector } from "react-redux";
import axios from "axios";
import ScrollToTop from "../ScrollToTop";

export default function Contact() {
  const Contact = useSelector((store) => store.Contact);

  const [formData, setFormData] = useState({
    full_name: "",
    phone: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [responseMsg, setResponseMsg] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id.toLowerCase()]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg("");

    try {
      await axios.post(`${config.API_URL_POST}/web/send-query`, formData);
      setResponseMsg("Request Sent Successfully!");
      setFormData({ full_name: "", phone: "", message: "" });
    } catch (error) {
      setResponseMsg("Failed to send message. Please try again.");
      console?.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <Header />
      <ContactApi />
      <section className="contact_sec my-5">
        <div className="container">
          <div className="title text-center">
            <h2>
              <span>Get</span> In Touch
            </h2>
          </div>

          <div className="row justify-content-around mt-5 pt-4">
            <div className="col-lg-5 mb-4">
              <div className="contact_form">
                <form onSubmit={handleSubmit}>
                  <h3>Leave us a message</h3>
                  {responseMsg && (
                    <div className="col-lg-12">
                      <p
                        className={
                          responseMsg.includes("Successfully")
                            ? "text-success"
                            : "text-danger"
                        }
                      >
                        {responseMsg}
                      </p>
                    </div>
                  )}
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label" htmlFor="full_name">
                        Name
                      </label>
                      <input
                        type="text"
                        id="full_name"
                        className="form-control"
                        placeholder="Name"
                        value={formData.full_name}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="col-lg-12 mb-3">
                      <label className="form-label" htmlFor="phone">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        className="form-control"
                        placeholder="Phone Number"
                        value={formData.phone}
                        onChange={(e) => {
                          const value = e.target.value;
                          if (/^\d{0,13}$/.test(value)) {
                            setFormData((prev) => ({ ...prev, phone: value }));
                          }
                        }}
                        maxLength={10}
                        required
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <label htmlFor="message" className="form-label">
                        Message
                      </label>
                      <textarea
                        className="form-control"
                        id="message"
                        rows="7"
                        placeholder="Describe your requirement here.."
                        value={formData.message}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="col-lg-12 mb-3">
                      <input
                        type="submit"
                        className="form-control send_message"
                        value={loading ? "Sending..." : "Send Message"}
                        disabled={loading}
                      />
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="col-lg-5  mb-4">
              {!Contact.status ? (
                <div className="placeholder-glow">
                  <span className="placeholder col-6"></span>
                  <span className="placeholder col-4"></span>
                  <span className="placeholder col-8"></span>
                  <span className="placeholder col-5"></span>
                </div>
              ) : (
                <div>
                  <div className="contact_content pe-5 mb-5">
                    <h1>Contact Us</h1>
                    <p>{Contact.data[3].content}</p>
                  </div>

                  <div className="contact_box d-flex align-items-top gap-2  mb-4  ">
                    <div className="conten_img">
                      <img src="/location_on.png" alt="" />
                    </div>
                    <div className="contne-rignt">
                      <h4>Address</h4>
                      <p>{Contact.data[0].content}</p>
                    </div>
                  </div>

                  <div className="contact_box d-flex align-items-top gap-2  mb-4">
                    <div className="conten_img">
                      <img src="/Phone_call.png" alt="" />
                    </div>
                    <div className="contne-rignt">
                      <h4>Call Us</h4>
                      <p>
                        <Link to={`tel:${Contact.data[1].content}`}>
                          {Contact.data[1].content}
                        </Link>
                      </p>
                    </div>
                  </div>

                  <div className="contact_box d-flex align-items-top gap-2 mb-4">
                    <div className="conten_img">
                      <img src="/Mail.png" alt="" />
                    </div>
                    <div className="contne-rignt">
                      <h4>E-mail Us</h4>
                      <p>
                        <Link to={`mailto:${Contact.data[2].content}`}>
                          {Contact.data[2].content}
                        </Link>
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

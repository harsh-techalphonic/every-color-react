import "./Footer.css";
import logo from "../../../assets/every-color.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookF,
  faInstagram,
  faLinkedin,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { Link } from "react-router-dom";
import TcpprcApi from "../../../API/TcpprcApi";
import ContactApi from "../../../API/ContactApi";
import AboutApi from "../../../API/AboutApi";
// import BrandApi from "../../../API/BrandApi";
import { useSelector } from "react-redux";
import AuthCheck from "../../../API/AuthCheck";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import NewsletterForm from "./NewsletterForm";


export default function Footer() {
  const categories = useSelector((store) => store.categories);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://dimgrey-eel-688395.hostingersite.com/api/web/send-newslatter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.info(result.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="Footer">
      <div className="container">
        <div className="footer-content ">
          <div className="row menubox-footer ">
            <div className="col-lg-3">
              <div className="footer-brand pe-lg-5 pe-md-4 pe-0">
                <div className="brand-logo mb-4">
                  <ToastContainer />
                  <Link to="#!">
                    <img src={logo} alt="" />
                  </Link>
                </div>
                <h3>Let's talk</h3>
                <p className="mb-0">
                  Shoot us an email and we will get back to you within 24
                  business hrs
                </p>
                <p className="mb-0">
                  Email us at:{" "}
                  <Link to="mailto:-customercare@uppercase.co.in">
                    customercare@uppercase.co.in
                  </Link>
                </p>
                <p className="mb-0">
                  Phone Number:{" "}
                  <Link to="tele:-+91 8691 800 800">+91 8691 800 800</Link>
                </p>

                <h3 className="mt-4">Follow our </h3>
                <p className="mb-0">
                  Get exclusive offers, a heads up on new ecopacks and a tribe
                  of eco-influencers.
                </p>
                <div className="social-links mt-3">
                  <ul className="list-unstyled d-flex gap-3">
                    <li>
                      <Link to="#!">
                        <FontAwesomeIcon icon={faFacebookF} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#!">
                        <FontAwesomeIcon icon={faInstagram} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#!">
                        <FontAwesomeIcon icon={faXTwitter} />
                      </Link>
                    </li>
                    <li>
                      <Link to="#!">
                        <FontAwesomeIcon icon={faLinkedin} />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 col-6 mt-5">
              <div className="menu-box">
                <h4>Quick Links</h4>
                <ul className="list-unstyled mt-4">
                  <li>
                    <Link to="/">Home</Link>
                  </li>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/product">Our Products</Link>
                  </li>
                  <li>
                    <Link to="/track-order">Track Orders</Link>
                  </li>
                  <li>
                    <Link to="/bulk-order">Bulk Order</Link>
                  </li>
                  <li>
                    <Link to="/bulk-order">Export</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-4  col-6  mt-5">
              <div className="menu-box">
                <h4>Categories</h4>
                <ul className="list-unstyled mt-4">
                  {categories.data?.map((category, index) => (
                    <li key={index}>
                      <Link to={`/category/${category.slug}`}>
                        {category.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 mt-5">
              <div className="bg-gray-900 menu-box text-white py-10">
                <div className="max-w-3xl mx-auto">
                  <h4 className="text-3xl font-bold mb-3">
                    Subscribe to Our Newsletter
                  </h4>
                  <p className="text-gray-400 mb-6">
                    Get the latest blogs, news, and updates straight to your
                    inbox.
                  </p>
                  <NewsletterForm/>
                  {/* <form
                    className="d-flex align-items-center position-relative"
                    onSubmit={handleSubmit}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="form-control px-4 py-3 rounded-rounded text-black flex-grow-1"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      disabled={loading}
                    />
                    <button
                      type="submit"
                      className="px-4 py-3 border-0 font-semibold position-absolute top-0 end-0"
                      disabled={loading}
                    >
                      {loading ? "..." : <FontAwesomeIcon icon={faPaperPlane} />}
                    </button>
                  </form> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright mt-3">
        <div className="container">
          <div className="d-flex justify-content-between">
            <div className="copytext">
              <p className="mb-0">
                Copyright © 2025 Tech Alphonic.All Rights Reserved.
              </p>
            </div>
            <div className="Payemt-img">
              <ul className="d-flex list-unstyled gap-3 text-white mb-0 align-items-center">
                <li>
                  <Link to={`/term&conditons`}> Term & conditons</Link>{" "}
                </li>
                <li>
                  <Link to={`/privacy-policy`}> Privacy & Policy</Link>{" "}
                </li>
                <li>
                  <Link to={`/return-policy`}> Return & Cancellation</Link>{" "}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <TcpprcApi />
      <ContactApi />
      <AboutApi />
      <AuthCheck />
    </section>
  );
}

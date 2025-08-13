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
import BrandApi from "../../../API/BrandApi";
import { useSelector } from "react-redux";
import AuthCheck from "../../../API/AuthCheck";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function Footer() {
  const categories = useSelector((store) => store.categories);
  return (
    <section className="Footer">
      <div className="container">
        <div className="footer-content ">
          <div className="row menubox-footer ">
            <div className="col-lg-3">
              <div className="footer-brand pe-lg-5 pe-md-4 pe-0">
                <div className="brand-logo mb-4">
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
            <div className="col-lg-3 col-md-4 mt-5">
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
                    <Link to="#!">Track Orders</Link>
                  </li>
                  <li>
                    <Link to="/contact-us">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </div>
            <div className="col-lg-3 col-md-4 mt-5">
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
              {/* <div className="menu-box">
                <h4>Blogs</h4>
                <ul className="list-unstyled mt-4">
                  <li className="d-flex gap-3">
                   <img src="/DealDay1.png"  alt="" style={{ width: "100px", height: "80px", borderRadius: "8px" }}/>
                    <div>
                      <p className="mb-0"><Link to="#!"  className="mb-0 fs-lg-5 fs-md-6">The Future of AI: What You Need to Know Today</Link></p>
                      <p className="text-white">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </li>
                  <li className="d-flex gap-3">
                   <img src="/DealDay1.png"  alt="" style={{ width: "100px", height: "80px", borderRadius: "8px" }}/>
                    <div>
                      <p className="mb-0"><Link to="#!"  className="mb-0 fs-lg-5 fs-md-6">The Future of AI: What You Need to Know Today</Link></p>
                      <p className="text-white">{new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</p>
                    </div>
                  </li>
                  
                </ul>
              </div> */}
              <section className="bg-gray-900 menu-box text-white py-10 px-5">
                <div className="max-w-3xl mx-auto">
                  <h4 className="text-3xl font-bold mb-3">
                    Subscribe to Our Newsletter
                  </h4>
                  <p className="text-gray-400 mb-6">
                    Get the latest blogs, news, and updates straight to your
                    inbox.
                  </p>
                  <form
                    className="d-flex align-items-center position-relative"
                    method="post"
                    action=""
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="form-control px-4 py-3 rounded-rounded text-black flex-grow-1"
                    />
                    <button type="submit" className=" px-4 py-3 border-0 font-semibold position-absolute top-0 end-0"><FontAwesomeIcon icon={faPaperPlane}/></button>
                  </form>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <div className="copyright">
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
      <BrandApi />
      <AuthCheck />
    </section>
  );
}

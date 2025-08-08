import React, { useState } from "react";
import axios from "axios";
import "./Login.css";
import Header from "../../../Components/Partials/Header/Header";
import Footer from "../../../Components/Partials/Footer/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import config from "../../../Config/config.json";
import { toast, ToastContainer } from "react-toastify";
import ScrollToTop from "../../ScrollToTop";
import { useDispatch } from "react-redux";
import { AuthCheckAction } from "../../../store/Auth/AuthCheckSlice";

export default function Login() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [validUser, setValidUser] = useState(0);
  const [loginWithPassword, setloginWithPassword] = useState(false);
  const [registerForm, setRegisterForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    cpassword: "",
    terms_conditions: 1,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const togglePasswordVisibility = () => {
    setPasswordVisible((prevState) => !prevState);
  };

  const authUser = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        phone,
      };
      const response = await axios.post(
        `${config.API_URL}/auth/login`,
        payload
      );
      const sendOtp = await axios.post(
        `${config.API_URL}/auth/send-otp`,
        payload
      );
      console.log("sendOtp", sendOtp);
      if (sendOtp.data.status == true) {
        toast.success(sendOtp?.data?.message);
        setPhone(sendOtp.data.otp.phone);
      }
      response.data.status == true && response.data.key == "user_exist"
        ? setValidUser(1)
        : setValidUser(2);
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const login = await axios.post(
        `${config.API_URL}/auth/login`,
        !loginWithPassword
          ? {
              phone,
              otp,
            }
          : {
              phone,
              password,
            }
      );
      if (login.data.status == true) {
        const { token, user } = login.data;

        dispatch(AuthCheckAction.addauth({ status: true }));
        localStorage.setItem("token", token);

        toast.success("Login successful!");
        setTimeout(() => navigate("/user-account"), 1000);
      } else {
        toast.error(login?.data?.message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (registerForm) {
      try {
        if (formData.password != formData.cpassword) {
          return toast.error("Confirm password must match the password.");
        }
        const response = await axios.post(`${config.API_URL}/auth/register`, {
          ...formData,
          phone,
        });
        if (response.data.status == true) {
          const { token, user } = response.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Register successful!");
          setTimeout(() => navigate("/user-account"), 1000);
        }

        if (response?.data?.errors) {
          const errors = response.data.errors;
          Object.keys(errors).forEach((key) => {
            errors[key].forEach((msg) => {
              toast.error(msg);
            });
          });
        } else {
          toast.error(response?.data?.message || "Something went wrong");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login or Register failed");
      } finally {
        setLoading(false);
      }
    } else {
      try {
        const response = await axios.post(`${config.API_URL}/auth/verify-otp`, {
          phone,
          otp,
        });
        if (response.data.status == false) {
          return toast.error(response?.data?.message || "Invalid Otp");
        }
        setRegisterForm(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "Login or Register failed");
      } finally {
        setLoading(false);
      }
    }
  };
  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <Header />

      <section className="login-sec">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
              <div className="login-box">
                <form
                  onSubmit={
                    validUser == 0
                      ? authUser
                      : validUser == 1
                      ? handleLogin
                      : handleRegister
                  }
                >
                  <h2 className="my-4">Login or signup</h2>
                  {!registerForm ? (
                    <>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone Number
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="phone"
                          placeholder="Enter phone number"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          required
                          pattern="\d{10}"
                          maxLength="10"
                        />
                      </div>
                      {!loginWithPassword &&
                      (validUser == 1 || validUser == 2) ? (
                        <div className="mb-3">
                          <label htmlFor="otp" className="form-label">
                            OTP
                          </label>
                          <input
                            type="text"
                            className="form-control"
                            id="otp"
                            placeholder="Enter OTP"
                            value={otp}
                            pattern="\d{4}"
                            maxLength="4"
                            onChange={(e) => setOtp(e.target.value)}
                            required
                          />
                        </div>
                      ) : (
                        ""
                      )}
                      {loginWithPassword ? (
                        <div className="mb-3 position-relative">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control"
                            id="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                          />
                          <span
                            className="fa field-icon toggle-password position-absolute"
                            onClick={togglePasswordVisibility}
                            style={{
                              top: "38px",
                              right: "10px",
                              cursor: "pointer",
                            }}
                          >
                            <FontAwesomeIcon
                              icon={passwordVisible ? faEyeSlash : faEye}
                            />
                          </span>
                        </div>
                      ) : (
                        ""
                      )}
                      {validUser == 1 ? (
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <div className="form-check form-switch align-items-center">
                            <input
                              className="form-check-input log_check"
                              type="checkbox"
                              role="switch"
                              id="switchCheckDefault"
                              checked={loginWithPassword}
                              onChange={(e) =>
                                setloginWithPassword(e.target.checked)
                              }
                            />
                            <label
                              className="form-check-label mb-0"
                              htmlFor="switchCheckDefault"
                            >
                              Login with Password
                            </label>
                          </div>
                          {/* <Link to="/forget-password">Forget Password?</Link> */}
                        </div>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <>
                      <div className="mb-3">
                        <label htmlFor="name" className="form-label">
                          Full Name
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          placeholder="Name"
                          autoComplete="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              name: e.target.value,
                            })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="email"
                          name="email"
                          placeholder="name@example.com"
                          autoComplete="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="phone" className="form-label">
                          Phone
                        </label>
                        <input
                          type="tel"
                          className="form-control"
                          id="phone"
                          name="phone"
                          placeholder="Phone"
                          autoComplete="tel"
                          value={phone}
                          readOnly
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Password
                        </label>
                        <div className="position-relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control password-field"
                            id="password"
                            name="password"
                            placeholder="Password"
                            autoComplete="new-password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
                            required
                          />
                          <FontAwesomeIcon
                            icon={passwordVisible ? faEyeSlash : faEye}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="cpassword" className="form-label">
                          Confirm Password
                        </label>
                        <div className="position-relative">
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control password-field"
                            id="cpassword"
                            name="cpassword"
                            placeholder="Confirm Password"
                            autoComplete="new-password"
                            value={formData.cpassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cpassword: e.target.value,
                              })
                            }
                            required
                          />
                          <FontAwesomeIcon
                            icon={passwordVisible ? faEyeSlash : faEye}
                          />
                        </div>
                      </div>
                      <div className="form-check d-flex align-items-center gap-3 mb-4">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          name="terms_conditions"
                          id="terms_conditions"
                          checked={formData.terms_conditions}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              terms_conditions: e.target.value,
                            })
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="terms_conditions"
                        >
                          I agree to the{" "}
                          <Link to="/terms">terms and conditions</Link>
                        </label>
                      </div>
                    </>
                  )}
                  <button className="form-control btn" type="submit">
                    Login or register
                  </button>
                  {/* 
                                    <div className="d-flex align-items-center justify-content-center text-center mt-3 dont-accnt">
                                        <p className="mb-0">
                                            Don't have an account? <Link to="/signup" className="ms-3">Sign up</Link>
                                        </p>
                                    </div> */}
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

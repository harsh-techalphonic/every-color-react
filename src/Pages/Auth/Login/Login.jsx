  import React, { useState, useEffect } from "react";
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
  import GstVerify from "./gstVerify";

  export default function Login({ onHeaderHeight }) {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [otpTimer, setOtpTimer] = useState(0);
    const [gstNumber, setGstNumber] = useState("");

    const [gstNo, setGstNo] = useState("");
    const [gstVerified, setGstVerified] = useState(false);
    const [gstError, setGstError] = useState("");
    const [gstDetails, setGstDetails] = useState(null);
    const [showGstPopup, setShowGstPopup] = useState(false);
    const [gstLoading, setGstLoading] = useState(false);

    const [validUser, setValidUser] = useState(0);
    const [loginWithPassword, setloginWithPassword] = useState(true);
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

    const togglePasswordVisibility = () => setPasswordVisible((prev) => !prev);

    const isValidPhone = (p) => /^[0-9]{10}$/.test(p || "");

    useEffect(() => {
      if (otpTimer > 0) {
        const timerId = setInterval(() => setOtpTimer((prev) => prev - 1), 1000);
        return () => clearInterval(timerId);
      }
    }, [otpTimer]);

    const sendOtpToUser = async () => {
      try {
        if (!isValidPhone(phone)) {
          toast.error("Enter a valid 10-digit phone number before sending OTP");
          return;
        }
        setLoading(true);
        const payload = { phone };
        const sendOtp = await axios.post(
          `${config.API_URL}/auth/send-otp`,
          payload
        );
        if (sendOtp?.data?.status === true) {
          toast.success(sendOtp?.data?.message || "OTP sent");
          console.log("otp", sendOtp?.data);
          setOtpTimer(60);
        } else {
          toast.error(sendOtp?.data?.message || "Failed to send OTP");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error sending OTP");
      } finally {
        setLoading(false);
      }
    };

    // Step 1: Check if user exists
    const checkUserAndProceed = async () => {
      try {
        setLoading(true);
        const payload = { phone };
        const response = await axios.post(
          `${config.API_URL}/auth/login`,
          payload
        );

        if (
          response?.data?.status === true &&
          response?.data?.key === "user_exist"
        ) {
          setValidUser(1); // Existing user
        } else {
          setValidUser(2); // New user
          setloginWithPassword(false); // Force OTP mode
          await sendOtpToUser();
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Error checking user");
      } finally {
        setLoading(false);
      }
    };

    const handleLogin = async () => {
      if (!isValidPhone(phone)) {
        toast.error("Please enter a valid 10-digit phone number");
        return;
      }
      if (loginWithPassword && !password) {
        toast.error("Password is required");
        return;
      }
      if (!loginWithPassword && !otp) {
        toast.error("OTP is required");
        return;
      }

      try {
        setLoading(true);
        const payload = loginWithPassword ? { phone, password } : { phone, otp };
        const login = await axios.post(`${config.API_URL}/auth/login`, payload);

        if (login?.data?.status === true) {
          const { token, user } = login.data;

          dispatch(AuthCheckAction.addauth({ status: true }));

          if (token) localStorage.setItem("token", token);
          if (user) localStorage.setItem("user", JSON.stringify(user));

          toast.success("Login successful!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          toast.error(login?.data?.message || "Login failed");
        }
      } catch (err) {
        toast.error(err.response?.data?.message || "Login failed");
      } finally {
        setLoading(false);
      }
    };

   
   const handleRegister = async () => {
  if (formData.password !== formData.cpassword) {
    toast.error("Confirm password must match the password.");
    return;
  }

  try {
    setLoading(true);

    const response = await axios.post(`${config.API_URL}/auth/register`, {
      ...formData,
      phone,

      // ✅ ADD THESE TWO
      gst_no: gstVerified ? gstNo : null,
      gst_response: gstVerified ? gstDetails?.gst_response : null,
    });

    if (response?.data?.status === true) {
      const { token, user } = response.data;
      if (token) localStorage.setItem("token", token);
      if (user) localStorage.setItem("user", JSON.stringify(user));
      toast.success("Register successful!");
      setTimeout(() => navigate("/"), 1000);
    } else {
      toast.error(response?.data?.message || "Something went wrong");
    }
  } catch (err) {
    toast.error(err.response?.data?.message || "Register failed");
  } finally {
    setLoading(false);
  }
};


    const verifyOtpForRegister = async () => {
      try {
        setLoading(true);
        const response = await axios.post(`${config.API_URL}/auth/verify-otp`, {
          phone,
          otp,
        });
        if (response?.data?.status === false) {
          toast.error(response?.data?.message || "Invalid OTP");
          return;
        }
        setRegisterForm(true);
      } catch (err) {
        toast.error(err.response?.data?.message || "OTP verification failed");
      } finally {
        setLoading(false);
      }
    };

    const verifyGst = async () => {
  if (!gstNo || gstNo.length !== 15) {
    setGstError("Enter valid 15 digit GST number");
    return;
  }

  try {
    setGstLoading(true);
    setGstError("");

    const res = await axios.post(
      `${config.API_URL}/user/gst-register`,
      { gst_no: gstNo }
    );
    
    if (res?.status === 200 || res.status === true) {
      console.log("gst api responce", res)
      setGstDetails(res.data);
      setShowGstPopup(true);  
    } else {
      setGstError(res.data.message || "Invalid GST");
    }
  } catch (err) {
    setGstError("GST verification failed");
  } finally {
    setGstLoading(false);
  }
};

    const handleSubmit = async (e) => {
      e.preventDefault();

      if (validUser === 0) {
        await checkUserAndProceed();
      } else if (validUser === 1) {
        await handleLogin();
      } else if (validUser === 2) {
        if (!registerForm) {
          await verifyOtpForRegister();
        } else {
          await handleRegister();
        }
      }
    };
 const handleGstVerify = async () => {
  // ✅ CLOSE MODAL IMMEDIATELY
  setShowGstPopup(false);
  setGstVerified(true);

  try {
    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${config.API_URL}/user/gst-register`,
      { gst_no: gstNo },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res?.data?.status === true) {
      if (res.data.user) {
        localStorage.setItem("user", JSON.stringify(res.data.user));
      }
      toast.success("GST verified & saved successfully");
    } else {
      toast.error(res.data.message || "Failed to save GST");
    }
  } catch (error) {
    toast.error("Error saving GST");
  }
};


    return (
      <>
        <ScrollToTop />
        <ToastContainer />
        <Header onHeight={onHeaderHeight} />

        <section className="login-sec">
          <div className="container h-100">
            <div className="row justify-content-center align-items-center h-100">
              <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
                <div className="login-box">
                  <form onSubmit={handleSubmit}>
                    <h2 className="my-4">Login or signup</h2>

                    {!registerForm ? (
                      <>
                        <div className="mb-3">
                          <label htmlFor="phone" className="form-label">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            className="form-control"
                            id="phone"
                            placeholder="Enter phone number"
                            value={phone}
                            onChange={(e) => {
                              const onlyDigits = e.target.value
                                .replace(/\D/g, "")
                                .slice(0, 10);
                              setPhone(onlyDigits);
                            }}
                            required
                            maxLength="10"
                          />
                        </div>

                        {validUser === 1 && loginWithPassword && (
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
                        )}

                        {(!loginWithPassword || validUser === 2) && (
                          <>
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
                                onChange={(e) =>
                                  setOtp(
                                    e.target.value.replace(/\D/g, "").slice(0, 6)
                                  )
                                }
                                required
                                maxLength="6"
                              />
                            </div>

                            <div className="mb-3 d-flex justify-content-end">
                              {otpTimer > 0 ? (
                                <span
                                  className="text-muted"
                                  style={{ color: "red", fontSize: "12px" }}
                                >
                                  Re-send OTP in {otpTimer}s
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  className="btn btn-link p-0"
                                  style={{ color: "red", fontSize: "12px" }}
                                  onClick={sendOtpToUser}
                                  disabled={!isValidPhone(phone) || loading}
                                >
                                  {loading ? "Please wait..." : "Resend OTP"}
                                </button>
                              )}
                            </div>
                          </>
                        )}

                        {validUser === 1 && (
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <div className="form-check form-switch align-items-center">
                              <input
                                className="form-check-input log_check"
                                type="checkbox"
                                role="switch"
                                id="switchCheckDefault"
                                checked={!loginWithPassword}
                                onChange={async (e) => {
                                  const isOtpMode = e.target.checked;
                                  if (isOtpMode) {
                                    if (!isValidPhone(phone)) {
                                      toast.error(
                                        "Enter a valid 10-digit phone number first"
                                      );
                                      return;
                                    }
                                    setloginWithPassword(false);
                                    await sendOtpToUser();
                                  } else {
                                    setloginWithPassword(true);
                                  }
                                }}
                              />
                              <label
                                className="form-check-label mb-0"
                                htmlFor="switchCheckDefault"
                              >
                                Login with OTP
                              </label>
                            </div>
                          </div>
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
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
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
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            required
                          />
                        </div>
                      {/* GST SECTION */}
{formData.business_owner === "yes" ? (
  <>
    <div className="col-lg-6 mb-3">
      <label className="form-label">GST Number</label>
      <input
        type="text"
        name="gst_no"
        value={formData.gst_no}
        className="form-control"
        disabled
      />
    </div>

    <div className="col-lg-6 mb-3">
      <label className="form-label">Tax Payer</label>
      <input
        type="text"
        name="tradeNam"
        value={formData.tradeNam}
        className="form-control"
        disabled
      />
    </div>
  </>
) : (
  <>
    {/* Gst Number (Verify Flow) */}
    <div className="mb-2 mt-3">
      <label htmlFor="gst" className="form-label">
        GST Number (Optional)
      </label>

      <div className="input-group mb-3">
        <input
          type="text"
          className={`form-control ${gstError ? "is-invalid" : ""}`}
          placeholder="Are you a Business user"
          value={gstNo}
          disabled={gstVerified}
          onChange={(e) => {
            const value = e.target.value.toUpperCase();
            if (value.length <= 15) {
              setGstNo(value);
              setGstVerified(false);
              setGstError("");
            }
          }}
        />

        <div
          className={`input-group-text ${
            gstVerified ? "bg-light text-success" : "c-pointer"
          }`}
          onClick={!gstVerified ? verifyGst : undefined}
          style={{ cursor: gstVerified ? "not-allowed" : "pointer" }}
        >
          {gstVerified ? "✔" : gstLoading ? "Verifying..." : "Verify"}
        </div>
      </div>

      {gstError && <small className="text-danger">{gstError}</small>}
    </div>
  </>
)}


                        <div className="mb-3 position-relative">
                          <label htmlFor="password" className="form-label">
                            Password
                          </label>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control"
                            id="password"
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                password: e.target.value,
                              })
                            }
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
                        <div className="mb-3 position-relative">
                          <label htmlFor="cpassword" className="form-label">
                            Confirm Password
                          </label>
                          <input
                            type={passwordVisible ? "text" : "password"}
                            className="form-control"
                            id="cpassword"
                            value={formData.cpassword}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                cpassword: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div className="form-check d-flex align-items-center gap-3 mb-4">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={formData.terms_conditions}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                terms_conditions: e.target.checked ? 1 : 0,
                              })
                            }
                          />
                          <label className="form-check-label">
                            I agree to the{" "}
                            <Link to="/term&conditons">terms and conditions</Link>
                          </label>
                        </div>

                        
                      </>
                    )}

                    <button
                      className="form-control btn"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? "Please wait..." : "Login or register"}
                    </button>
                    {validUser === 1 && (
                      <p className="d-flex justify-content-center mt-3">
                        <Link to="/forget-password">Forget Password?</Link>
                      </p>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />



        {showGstPopup && (
        <GstVerify
          gstDetails={gstDetails}
          onClose={() => setShowGstPopup(false)}
          onVerify={handleGstVerify}
        />
        )}
      </>
    );
  }

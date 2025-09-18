import React, { useEffect, useState } from "react";
import "./AccountDetails.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import config from "../../../Config/config.json";
import axios from "axios";
import { fetchUserDataApi } from "../../../API/AllApiCode";
import { toast } from "react-toastify";

export default function AccountDetails() {
  const [userProfileDta, setUserProfileDta] = useState({});
  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
  });

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);

  // fetch user profile
  const getUserProfile = async () => {
    try {
      const userResponse = await fetchUserDataApi();
      if (userResponse?.user) {
        setUserProfileDta(userResponse.user);

        setFormData({
          firstName: userResponse.user.name?.split(" ")[0] || "",
          lastName: userResponse.user.name?.split(" ")[1] || "",
          phone: userResponse.user.phone || "",
          email: userResponse.user.email || "",
        });

        setPreview(userResponse.user.profile_image || "");
      }
    } catch (err) {
      console.error("Error loading user profile:", err);
    }
  };

  useEffect(() => {
    getUserProfile();
  }, []);

  // handle image
  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  // handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // send OTP
  const sendOtpToUser = async (oldPhone) => {
    try {
      if (!oldPhone || oldPhone.length !== 10) {
        toast.error("Enter a valid 10-digit phone number before sending OTP");
        return;
      }

      setLoading(true);
      const token = localStorage.getItem("token");
      const payload = { phone: oldPhone };

      const sendOtp = await axios.post(
        `${config.API_URL}/auth/send-otp`,
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (sendOtp?.data?.status === true) {
        console.log("OTP sent by API:", sendOtp.data?.otp?.otp);
        toast.success(sendOtp?.data?.message || "OTP sent successfully!");
        setOtpTimer(60);
        setOtpSent(true);
      } else {
        toast.error(sendOtp?.data?.message || "Failed to send OTP");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP");
    } finally {
      setLoading(false);
    }
  };

  // verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${config.API_URL}/auth/verify-otp`,
        { phone: userProfileDta.phone, otp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (res.data?.status === true) {
        toast.success(res.data?.message || "OTP verified successfully!");
        setOtpSent(false);
        setOtp("");
        await updateAccountAPI();
        toast.success("Profile updated successfully!");
        await getUserProfile();
      } else {
        toast.error(res.data?.message || "Invalid OTP!");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // update API
  const updateAccountAPI = async () => {
    const token = localStorage.getItem("token");
    const payload = new FormData();

    payload.append("name", `${formData.firstName} ${formData.lastName}`);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);

    if (file) {
      payload.append("profile", file);
    }

    return await axios.post(`${config.API_URL}/user/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });
    
  };

  // single button handler
  const handleAction = async () => {
    if (otpSent) {
      // if OTP already sent → verify OTP
      await verifyOtp();
    } else {
      if (formData.phone !== userProfileDta.phone) {
        // phone changed → send OTP
        await sendOtpToUser(userProfileDta.phone);
     
      } else {
        // no phone change → update directly
        try {
          setLoading(true);
          await updateAccountAPI();
          toast.success("Changes saved successfully!");
          await getUserProfile();
        } catch (error) {
          toast.error("An error occurred while saving.");
        } finally {
          setLoading(false);
        }
      }
    }
  };


  // timer countdown
  useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  return (
    <div className="AccountDetails">
      <div className="row">
        <div className="col-xl-8 col-lg-12 ">
          <div className="card">
            <ul className="list-group list-group-flush">
              <li className="list-group-item">Your Profile</li>
            </ul>
            <div className="row">
              {/* Avatar Upload */}
              <div className="col-lg-3">
                <div className="col-lg-12 mb-3">
                  <div className="avatar-upload">
                    <div className="avatar-edit">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="imageUpload">
                        <FontAwesomeIcon icon={faUpload} />
                      </label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: `url(${preview})`,
                          display: "block",
                          transition: "opacity 0.65s ease-in-out",
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Profile Form */}
              <div className="col-lg-9">
                <div className="card-body px-5">
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Email Address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="form-control"
                      />
                    </div>
                  </div>

                  {/* OTP Section */}
                  {otpSent && (
                    <div className="mt-4 otp-section">
                      <label className="form-label">Enter OTP sent to your {" "} <strong>{userProfileDta.phone}</strong></label>
                      <div className="d-flex gap-2">
                        <input
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          className="form-control"
                          placeholder="Enter OTP"
                        />
                      </div>
                      {otpTimer > 0 ? (
                        <p className="mt-2">Resend OTP in {otpTimer}s</p>
                      ) : (
                        <button
                          type="button"
                          className="btn btn-link p-0 mt-2"
                          onClick={() => sendOtpToUser(userProfileDta.phone)}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}

                  {/* Single Button */}
                  <div className="mt-4 profile-save_btn">
                    <button type="button" onClick={handleAction} disabled={loading}>
                      {loading
                        ? "Processing..."
                        : otpSent
                        ? "Verify OTP"
                        : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>  
    </div>
  );
}

"use client"

import { useEffect, useState } from "react"
import "./AccountDetails.css"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faUpload, faCheck } from "@fortawesome/free-solid-svg-icons"
import config from "../../../Config/config.json"
import axios from "axios"
import { fetchUserDataApi } from "../../../API/AllApiCode"
import { toast } from "react-toastify"
import GstVerify from "../../../Pages/Auth/Login/gstVerify"

export default function AccountDetails() {
  const [userProfileDta, setUserProfileDta] = useState({})
  const [preview, setPreview] = useState("")
  const [file, setFile] = useState(null)
  const [gstNo, setGstNo] = useState("")
  const [gstVerified, setGstVerified] = useState(false)
  const [gstLoading, setGstLoading] = useState(false)
  const [gstError, setGstError] = useState("")
  const [showGstPopup, setShowGstPopup] = useState(false)
  const [gstDetails, setGstDetails] = useState(null)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    gst_no: "",
    tradeNam: "",
    business_owner: "no",
  })

  const [loading, setLoading] = useState(false)
  const [otp, setOtp] = useState("")
  const [otpSent, setOtpSent] = useState(false)
  const [otpTimer, setOtpTimer] = useState(0)

  // fetch user profile
  const getUserProfile = async () => {
    try {
      const userResponse = await fetchUserDataApi()

      if (userResponse?.user) {
        const user = userResponse.user

        setUserProfileDta(user)

        const firstName = user.name?.split(" ")[0] || ""
        const lastName = user.name?.split(" ")[1] || ""

        setFormData({
          firstName,
          lastName,
          phone: user.phone || "",
          email: user.email || "",
          gst_no: user.gst_no || "",
          tradeNam: user.gst_response?.taxpayerInfo?.lgnm || "",
          business_owner: user.business_owner || "no",
        })

        // GST UI sync
        setGstNo(user.gst_no || "")
        setGstVerified(!!user.gst_no)
        if (user.gst_response) {
          setGstDetails(user.gst_response)
        }

        setPreview(user.profile_image || "")
      }
    } catch (err) {
      console.error("Error loading user profile:", err)
    }
  }

  useEffect(() => {
    getUserProfile()
  }, [])

  // handle image
  const handleImageChange = (e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result)
      }
      reader.readAsDataURL(selectedFile)
    }
  }

  // handle input
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  // send OTP
  const sendOtpToUser = async (oldPhone) => {
    try {
      if (!oldPhone || oldPhone.length !== 10) {
        toast.error("Enter a valid 10-digit phone number before sending OTP")
        return
      }

      setLoading(true)
      const token = localStorage.getItem("token")
      const payload = { phone: oldPhone }

      const sendOtp = await axios.post(`${config.API_URL}/auth/send-otp`, payload, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (sendOtp?.data?.status === true) {
        toast.success(sendOtp?.data?.message || "OTP sent successfully!")
        setOtpTimer(60)
        setOtpSent(true)
      } else {
        toast.error(sendOtp?.data?.message || "Failed to send OTP")
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error sending OTP")
    } finally {
      setLoading(false)
    }
  }

  // verify OTP
  const verifyOtp = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")

      const res = await axios.post(
        `${config.API_URL}/auth/verify-otp`,
        { phone: formData.phone, otp },
        { headers: { Authorization: `Bearer ${token}` } },
      )

      if (res.data?.status === true) {
        toast.success(res.data?.message || "OTP verified successfully!")
        setOtpSent(false)
        setOtp("")
        await updateAccountAPI()
        toast.success("Profile updated successfully!")
        await getUserProfile()
      } else {
        toast.error(res.data?.message || "Invalid OTP!")
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "OTP verification failed.")
    } finally {
      setLoading(false)
    }
  }

  // update API
  const updateAccountAPI = async () => {
    const token = localStorage.getItem("token")
    const payload = new FormData()

    payload.append("name", `${formData.firstName} ${formData.lastName}`)
    payload.append("email", formData.email)
    payload.append("phone", formData.phone)

    if (gstVerified && gstNo) {
      payload.append("gst_no", gstNo)
      if (gstDetails) {
        payload.append("gst_response", JSON.stringify(gstDetails.gst_response))
      }
    }

    if (file) {
      payload.append("profile", file)
    }

    const response = await axios.post(`${config.API_URL}/user/update-profile`, payload, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    })

    if (response?.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user))
    }

    return response
  }

  // single button handler
  const handleAction = async () => {
    if (otpSent) {
      // if OTP already sent → verify OTP
      await verifyOtp()
    } else {
      if (formData.phone !== userProfileDta.phone) {
        // phone changed → send OTP
        await sendOtpToUser(formData.phone)
      } else {
        // no phone change → update directly
        try {
          setLoading(true)
          await updateAccountAPI()
          toast.success("Changes saved successfully!")
          await getUserProfile()
        } catch (error) {
          toast.error("An error occurred while saving.")
        } finally {
          setLoading(false)
        }
      }
    }
  }

  useEffect(() => {
    let timer
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer((t) => t - 1), 1000)
    }
    return () => clearTimeout(timer)
  }, [otpTimer])

  const verifyGst = async () => {
    if (!gstNo || gstNo.length !== 15) {
      setGstError("Enter valid 15 digit GST number")
      return
    }

    try {
      setGstLoading(true)
      setGstError("")

      const res = await axios.post(`${config.API_URL}/user/gst-register`, {
        gst_no: gstNo,
      })

      if (res?.status === 200 || res.data?.status === true) {
        console.log("gst api response", res)
        setGstDetails(res.data)
        setShowGstPopup(true)
      } else {
        setGstError(res.data.message || "Invalid GST")
      }
    } catch (err) {
      setGstError("GST verification failed")
    } finally {
      setGstLoading(false)
    }
  }

  const handleGstVerify = async () => {
    setShowGstPopup(false)
    setGstVerified(true)
    toast.success("GST verified successfully")

    try {
      const token = localStorage.getItem("token")

      const payload = new FormData()
      payload.append("name", `${formData.firstName} ${formData.lastName}`)
      payload.append("email", formData.email)
      payload.append("phone", formData.phone)
      payload.append("gst_no", gstNo)

      if (gstDetails) {
        payload.append("gst_response", JSON.stringify(gstDetails))
      }

      const res = await axios.post(`${config.API_URL}/user/update-profile`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })

      if (res?.data?.status === true || res?.status === 200) {
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user))
        }
        toast.success("GST verified & saved successfully")
        await getUserProfile()
      } else {
        toast.error(res.data.message || "Failed to save GST")
        setGstVerified(false)
      }
    } catch (error) {
      console.error("Error saving GST:", error)
      toast.error("Error saving GST")
      setGstVerified(false)
    }
  }

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
                      <input type="file" id="imageUpload" accept=".png, .jpg, .jpeg" onChange={handleImageChange} />
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
                <div className="card-body px-5 ms-3">
                  <div className="row">
                    <div className="col-lg-6 mb-3">
                      <label className="form-label">First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={formData?.firstName}
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

                    {/* GST SECTION */}
                    {formData.business_owner === "yes" ? (
                      <>
                        <div className="col-lg-6 mb-3">
                          <label>GST Number</label>
                          <input className="form-control" value={formData.gst_no} disabled />
                        </div>

                        <div className="col-lg-6 mb-3">
                          <label>Tax Payer</label>
                          <input className="form-control" value={formData.tradeNam} disabled />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="col-lg-6 mb-3">
                          <label>GST Number (Optional)</label>
                          <div className="input-group">
                            <input
                              className="form-control"
                              value={gstNo}
                              onChange={(e) => setGstNo(e.target.value.toUpperCase())}
                              disabled={gstVerified}
                            />
                            <button
                              className={`btn ${gstVerified ? "btn-success" : "btn-outline-success"}`}
                              onClick={verifyGst}
                              disabled={gstLoading || gstVerified}
                            >
                              {gstVerified ? (
                                <FontAwesomeIcon icon={faCheck} />
                              ) : gstLoading ? (
                                "Verifying..."
                              ) : (
                                "Verify"
                              )}
                            </button>
                          </div>
                          {gstError && <small className="text-danger">{gstError}</small>}
                          {gstVerified && <small className="text-success">GST Verified ✓</small>}
                        </div>
                      </>
                    )}
                  </div>

                  {/* OTP Section */}
                  {otpSent && (
                    <div className="mt-4 otp-section">
                      <label className="form-label">
                        Enter OTP sent to your <strong>{userProfileDta.phone}</strong>
                      </label>
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
                          onClick={() => sendOtpToUser(formData.phone)}
                        >
                          Resend OTP
                        </button>
                      )}
                    </div>
                  )}
                  {showGstPopup && (
                    <GstVerify
                      gstDetails={gstDetails}
                      onClose={() => setShowGstPopup(false)}
                      onVerify={handleGstVerify}
                    />
                  )}

                  {/* Single Button */}
                  <div className="mt-4 profile-save_btn">
                    <button type="button" onClick={handleAction} disabled={loading}>
                      {loading ? "Processing..." : otpSent ? "Verify OTP" : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

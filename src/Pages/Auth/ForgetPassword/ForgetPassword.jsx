import React, { useState } from 'react';
import './ForgetPassword.css';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import ScrollToTop from '../../ScrollToTop';

export default function ForgetPassword() {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidPhone = (phone) => /^\d{10}$/.test(phone);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  if (!isValidPhone(phone)) {
    setLoading(false);
    setError('Please enter a valid 10-digit phone number.');
    return;
  }

  try {
    const response = await axios.post(`${config.API_URL}/auth/login`, { phone });
    // console.log("response login", response);

    if (!response?.data) {
      toast.error("Unexpected response from server. Please try again later.");
      return;
    }

    const { status, msg } = response.data;

    if (status === true) {
      toast.success('Phone verified. Sending OTP...');

      try {
        const otpResponse = await axios.post(`${config.API_URL}/auth/send-otp`, { phone });
        // console.log("otpResponse", otpResponse);

        if (!otpResponse?.data) {
          toast.error("Failed to receive OTP response. Please try again.");
          return;
        }

        // Extract phone and OTP from response
        const otpData = otpResponse.data.otp;
        const otpPhone = otpData.phone;
        const otpCode = otpData.otp;

        navigate("/verify", {
          state: { phone: otpPhone, otp: otpCode, from: "forget-password" },
        });

      } catch (otpError) {
        const otpMsg =
          otpError?.response?.data?.msg ||
          otpError?.message ||
          'Error sending OTP. Please try again later.';
        toast.error(otpMsg);
      }

    } else {
      if (msg === 'Phone does not exist') {
        toast.error('This phone number is not registered.');
      } else {
        toast.error(msg || 'Something went wrong. Please try again.');
      }
    }

  } catch (err) {
    const fallbackMsg =
      err?.response?.data?.msg ||
      err?.message ||
      'Network error. Please check your connection.';
    toast.error(fallbackMsg);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <Header />
      <section className="forget_sec">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-md-5 my-5">
              <div className="login-box">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Forget your password</h2>
                  <p>
                    Enter the phone number associated with your account and we will send you an OTP to reset your password.
                  </p>

                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      className="form-control w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200"
                      id="phone"
                      placeholder="9876543201"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className="text-danger mb-3" aria-live="polite">
                      {error}
                    </p>
                  )}

                  <button
                    className="form-control w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 cursor-pointer"
                    type="submit"
                    disabled={loading}
                  >
                    {loading ? 'Verifying phone...' : 'Continue'}
                  </button>

                  <div className="d-flex align-items-center justify-content-center text-center mt-3 dont-accnt">
                    <p className="mb-0">
                      <Link to="/login" className="ms-3">Back to Login or Sign up</Link>
                    </p>
                  </div>
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

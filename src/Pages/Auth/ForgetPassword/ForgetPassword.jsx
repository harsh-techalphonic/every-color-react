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
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!isValidEmail(email)) {
      setLoading(false);
      setError('Please enter a valid email address.');
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL_POST}/check-email`, { email });

      if (!response?.data) {
        toast.error("Unexpected response from server. Please try again later.");
        return;
      }

      const { type, msg } = response.data;

      if (type === 'Success') {
        toast.success('Email verified. Sending OTP...');

        try {
          const otpResponse = await axios.post(`${config.API_URL_POST}/send-otp-in-mail`, { email });

          if (!otpResponse?.data) {
            toast.error("Failed to receive OTP response. Please try again.");
            return;
          }

          const { email: otpEmail, otp } = otpResponse.data;

          navigate("/verify", {
            state: { email: otpEmail, otp, from: "forget-password" },
          });

        } catch (otpError) {
          const otpMsg =
            otpError?.response?.data?.msg ||
            otpError?.message ||
            'Error sending OTP. Please try again later.';
          toast.error(otpMsg);
        }

      } else if (type === 'Error') {
        if (msg === 'Email does not exist') {
          toast.error('This email does not exist in our records.');
        } else {
          toast.error(msg || 'Something went wrong. Please try again.');
        }
      } else {
        toast.error('Unexpected server response. Please try again later.');
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
    <ScrollToTop/>
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
                    Enter the email address associated with your account and we will send you a link to reset your password.
                  </p>

                  <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      className="form-control w-full p-3 border rounded-lg focus:ring focus:ring-indigo-200"
                      id="email"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                    {loading ? 'Verifying email...' : 'Continue'}
                  </button>

                  <div className="d-flex align-items-center justify-content-center text-center mt-3 dont-accnt">
                    <p className="mb-0">
                      <Link to="/login" className="ms-3">Back to Sign in</Link>
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

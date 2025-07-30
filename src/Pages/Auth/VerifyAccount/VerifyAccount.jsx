import React, { useEffect, useState, useRef } from 'react';
import './VerifyAccount.css';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import config from '../../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import ScrollToTop from '../../ScrollToTop';

const OTP_LENGTH = 6;

export default function VerifyAccount() {
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from;
  const email = location.state?.email;
  const backOtp = location.state?.otp;

  useEffect(() => {
    if (!email || !backOtp) {
      toast.error('Invalid access. Redirecting...');
      navigate('/login');
    }
  }, [email, backOtp, navigate]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (resendDisabled) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            setResendDisabled(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [resendDisabled]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (!value) return;

    const newOtp = [...otp];
    newOtp[index] = value[0];
    setOtp(newOtp);

    if (index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('Text').replace(/\D/g, '');
    if (pasteData.length === OTP_LENGTH) {
      const newOtp = pasteData.split('').slice(0, OTP_LENGTH);
      setOtp(newOtp);
      inputsRef.current[OTP_LENGTH - 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      const newOtp = [...otp];

      if (otp[index]) {
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        newOtp[index - 1] = '';
        setOtp(newOtp);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const code = otp.join('');

    toast.info('Verification in progress...');

    if (otp.includes('')) {
      toast.error('Please enter the full 6-digit code.');
      setLoading(false);
      return;
    }

    if (code !== backOtp) {
      toast.error('Incorrect OTP. Please try again.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${config.API_URL_POST}/otp-success`, {
        email,
        email_verified: 1,
        code,
      });

      if (response.status === 200) {
        toast.success('OTP verified successfully!');
        setTimeout(() => {
          if (from === 'forget-password') {
            navigate('/reset-password', { state: { email } });
          } else {
            navigate('/login');
          }
        }, 1500);
      } else {
        toast.error('OTP verification failed. Please try again.');
        setLoading(false);
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'An error occurred. Please try again later.');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      if (!email) {
        toast.error('Missing email address for resending OTP.');
        return;
      }

      await axios.post(`${config.API_URL_POST}/send-otp-in-mail`, { email });

      toast.info('OTP resent successfully!');
      setOtp(Array(OTP_LENGTH).fill(''));
      setCountdown(60);
      setResendDisabled(true);
      inputsRef.current[0]?.focus();
    } catch (error) {
      console.error(error);
      toast.error('Failed to resend OTP. Try again later.');
    }
  };

  return (
    <>
    <ScrollToTop/>
    <ToastContainer />
      <Header />
      <section className="login-sec verify_sec">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
              <div className="login-box text-center">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Verify Your Email Address</h2>
                  <p>Please enter the verification code sent to your email address.</p>

                  <div className="mb-3 text-left">
                    <div className="d-flex align-items-center justify-content-between mb-2">
                      <label htmlFor="otp" className="form-label mb-0">Verification Code</label>
                      {resendDisabled ? (
                        <span>Resend Code in {countdown}s</span>
                      ) : (
                        <span
                          className="text-primary"
                          onClick={handleResend}
                          style={{ cursor: 'pointer' }}
                        >
                          Resend Code
                        </span>
                      )}
                    </div>

                    <div className="otp-input d-flex justify-content-between">
                      {otp.map((digit, index) => (
                        <input
                          key={index}
                          type="text"
                          inputMode="numeric"
                          maxLength="1"
                          className="form-control text-center mx-1"
                          value={digit}
                          onChange={(e) => handleOtpChange(e, index)}
                          onKeyDown={(e) => handleKeyDown(e, index)}
                          onPaste={index === 0 ? handlePaste : undefined}
                          ref={(el) => (inputsRef.current[index] = el)}
                          disabled={loading}
                          aria-label={`OTP digit ${index + 1}`}
                          required
                        />
                      ))}
                    </div>
                  </div>

                  <button className="form-control btn" type="submit" disabled={loading}>
                    {loading ? 'Verifying...' : 'Continue'}
                  </button>

                  <div className="d-flex align-items-center justify-content-center text-center mt-3 dont-accnt">
                    <p className="mb-0">
                      <a href="/signup" className="ms-3">Back to Sign Up</a>
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

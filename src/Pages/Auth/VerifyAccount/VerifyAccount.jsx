import React, { useState, useRef, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import ScrollToTop from '../../ScrollToTop';

export default function VerifyAccount() {
  const location = useLocation();
  const navigate = useNavigate();
  const { phone } = location.state || {};

  const OTP_LENGTH = 4; // change to 6 if your backend uses 6-digit codes

  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(''));
  const inputsRef = useRef([]);

  const [countdown, setCountdown] = useState(60);
  const [resendDisabled, setResendDisabled] = useState(true);

  useEffect(() => {
    let timer;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [countdown, resendDisabled]);

  const handleOtpChange = (e, index) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value) {
      const newOtp = [...otp];
      newOtp[index] = value.slice(-1); // ensure single digit
      setOtp(newOtp);
      if (index < OTP_LENGTH - 1) {
        inputsRef.current[index + 1]?.focus();
      }
    } else {
      const newOtp = [...otp];
      newOtp[index] = '';
      setOtp(newOtp);
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    const pasted = e.clipboardData.getData('Text').replace(/\D/g, '').slice(0, OTP_LENGTH).split('');
    if (!pasted.length) return;
    const newOtp = [...otp];
    pasted.forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH) - 1]?.focus();
  };

  const handleResend = async () => {
    try {
      setResendDisabled(true);
      setCountdown(60);
      // clear current input after resend to avoid confusion
      setOtp(Array(OTP_LENGTH).fill(''));
      inputsRef.current[0]?.focus();

      const res = await axios.post(`${config.API_URL}/auth/send-otp`, { phone });
      if (res?.data?.status) {
        // console.log("resend Otp", res)
        toast.success('OTP resent successfully');
        // NOTE: Many backends won't return the OTP for security (that's fine).
        // We verify only with the backend in handleVerify.
      } else {
        toast.error(res?.data?.msg || 'Failed to resend OTP');
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Error resending OTP');
      setResendDisabled(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join('');
    if (enteredOtp.length !== OTP_LENGTH) {
      toast.error(`Please enter the ${OTP_LENGTH}-digit code.`);
      return;
    }

    try {
      setLoading(true);
      // Always verify with backend (no fragile client-side compare)
      const res = await axios.post(`${config.API_URL}/auth/verify-otp`, {
        phone,
        otp: enteredOtp,
      });

      if (res?.data?.status === true) {
        toast.success('OTP verified successfully');
        // Pass the latest entered OTP forward (works for flows that need it on the next page)
        navigate('/reset-password', { state: { phone, otp: enteredOtp } });
      } else {
        toast.error(res?.data?.msg || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      toast.error(err?.response?.data?.msg || 'Error verifying OTP');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ScrollToTop />
      <ToastContainer />
      <Header />
      <section className="login-sec verify_sec">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
              <div className="login-box text-center">
                <form onSubmit={handleVerify}>
                  <h2 className="my-4">Verify Your Phone Number</h2>
                  <p>Please enter the verification code sent to your phone: {phone}</p>

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
                      <a href="/login" className="ms-3">Back to Login or Sign Up</a>
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

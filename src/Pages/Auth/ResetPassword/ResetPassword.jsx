import React, { useState } from 'react';
import './ResetPassword.css';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import ScrollToTop from '../../ScrollToTop';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const togglePasswordVisibility = (field) => {
    if (field === 'password') {
      setShowPassword(!showPassword);
    } else if (field === 'confirmPassword') {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!email) {
      toast.error('Email not provided. Please try again.');
      return;
    }
  
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/;
  
    if (!passwordRegex.test(password)) {
      toast.error('Your password should have at least 6 characters, including a capital letter, a lowercase letter, a number, and a special symbol.');
      return;
    }
  
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(`${config.API_URL_POST}/reset-password`, {
        password,
        email,
      });
  
      if (response.status === 200) {
        toast.success('Password reset successfully.');
        setPassword('');
        setConfirmPassword('');
  
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        toast.error(response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Failed to reset password. Try again later.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <>
    <ScrollToTop/>
    <ToastContainer />
      <Header />
      <section className="reset_pass-sec">
        <div className="container h-100">
          <div className="row justify-content-center align-items-center h-100">
            <div className="col-md-5 my-5">
              <div className="login-box">
                <form onSubmit={handleSubmit}>
                  <h2 className="my-4">Reset your password</h2>
                  <p>Enter your new password and confirm it below.</p>

                  <div className="mb-3">
                    <label htmlFor="new-password" className="form-label">Password</label>
                    <div className="position-relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        className="form-control password-field"
                        id="new-password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <FontAwesomeIcon
                        icon={showPassword ? faEyeSlash : faEye}
                        className="field-icon toggle-password"
                        onClick={() => togglePasswordVisibility('password')}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirm-password" className="form-label">Confirm Password</label>
                    <div className="position-relative">
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="form-control password-field"
                        id="confirm-password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                      />
                      <FontAwesomeIcon
                        icon={showConfirmPassword ? faEyeSlash : faEye}
                        className="field-icon toggle-password"
                        onClick={() => togglePasswordVisibility('confirmPassword')}
                      />
                    </div>
                  </div>

                  <button className="form-control btn btn-primary" type="submit" disabled={loading}>
                    {loading ? 'Updating...' : 'Save Change'}
                  </button>
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

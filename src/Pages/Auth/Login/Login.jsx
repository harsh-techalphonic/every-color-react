import React, { useState } from 'react';
import axios from 'axios';
import './Login.css';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import config from "../../../Config/config.json";
import { toast, ToastContainer } from 'react-toastify';
import ScrollToTop from '../../ScrollToTop';

export default function Login() {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loginWithOTP, setLoginWithOTP] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                phone,
                ...(loginWithOTP ? { otp: password } : { password }),
            };

            const response = await axios.post(`${config.API_URL}/auth/login`, payload);

            const { token, user } = response.data;

            // Save to localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            toast.success('Login successful!');
            setTimeout(() => navigate('/user-account'), 1500);

        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
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
                                <form onSubmit={handleLogin}>
                                    <h2 className="my-4">Login to your account</h2>

                                    <div className="mb-3">
                                        <label htmlFor="phone" className="form-label">Phone Number</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="phone"
                                            placeholder="Enter phone number"
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            required
                                            pattern="\d{10,12}"
                                            maxLength="12"
                                        />
                                    </div>

                                    {!loginWithOTP ? (
                                        <div className="mb-3 position-relative">
                                            <label htmlFor="password" className="form-label">Password</label>
                                            <input
                                                type={passwordVisible ? 'text' : 'password'}
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
                                                style={{ top: '38px', right: '10px', cursor: 'pointer' }}
                                            >
                                                <FontAwesomeIcon icon={passwordVisible ? faEyeSlash : faEye} />
                                            </span>
                                        </div>
                                    ) : (
                                        <div className="mb-3">
                                            <label htmlFor="otp" className="form-label">OTP</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="otp"
                                                placeholder="Enter OTP"
                                                value={password}
                                                onChange={(e) => setPassword(e.target.value)}
                                                required
                                            />
                                        </div>
                                    )}

                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <div className="form-check form-switch align-items-center">
                                            <input
                                                className="form-check-input log_check"
                                                type="checkbox"
                                                role="switch"
                                                id="switchCheckDefault"
                                                checked={loginWithOTP}
                                                onChange={(e) => setLoginWithOTP(e.target.checked)}
                                            />
                                            <label className="form-check-label mb-0" htmlFor="switchCheckDefault">
                                                Login with OTP
                                            </label>
                                        </div>
                                        <Link to="/forget-password">Forget Password?</Link>
                                    </div>

                                    <button className="form-control btn" type="submit" disabled={loading}>
                                        {loading ? 'Logging in...' : 'Login Now'}
                                    </button>

                                    <div className="d-flex align-items-center justify-content-center text-center mt-3 dont-accnt">
                                        <p className="mb-0">
                                            Don't have an account? <Link to="/signup" className="ms-3">Sign up</Link>
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

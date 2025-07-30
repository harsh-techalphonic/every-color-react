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
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [verificationText, setVerificationText] = useState('');
    const [message, setMessage] = useState(null); 
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible((prevState) => !prevState);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        setMessage(null);

        try {
            const response = await axios.post(`${config.API_URL_POST}/login`, {
                username,
                password
            });

            console.log("Response Data:", response.data);

            localStorage.setItem('token', response.data.token);

            const user = response.data.users;

            if (user.email_verified === "1") {
                toast.success('Login successfully!');
                setTimeout(() => navigate('/user-account'), 1500);
            } else {
                try {
                    const otpResponse = await axios.post(
                        `${config.API_URL_POST}/send-otp-in-mail`,
                        { email: user.email }
                    );

                    const { email, otp } = otpResponse.data;
                    console.log("OTP sent to email:", email, "OTP:", otp);

                    navigate("/verify", {
                        state: { email, otp },
                    });
                } catch (otpError) {
                    toast.error("Error sending OTP:", otpError.response?.data || otpError.message);
                    toast.info({
                        text: "Login successful, but OTP could not be sent.",
                        type: "error",
                    });
                }
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <ScrollToTop/>
        <ToastContainer />
            <Header />
            <section className="login-sec">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-xl-5 col-lg-6 col-md-8 col-12 my-5">
                            <div className="login-box">
                                <form onSubmit={handleLogin}>
                                    <h2 className="my-4">Login to your account</h2>

                                    {error && <p className="text-danger">{error}</p>}
                                    {message && <p className={`text-${message.type}`}>{message.text}</p>}
                                    {verificationText && <p className="text-success">{verificationText}</p>}
                                    
                                    <div className="mb-3">
                                        <label htmlFor="username" className="form-label">Email / Username</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="username"
                                            placeholder="name@example.com"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div className="mb-3 position-relative">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type={passwordVisible ? 'text' : 'password'}
                                            className="form-control password-field"
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
                                        <p className="d-flex justify-content-end mt-2 mb-0">
                                            <Link to="/forget-password">Forget Password?</Link>
                                        </p>
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

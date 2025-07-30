import React, { useEffect, useRef, useState } from 'react';
import './BecomeSeller.css'
import axios from 'axios';
import Header from '../../../Components/Partials/Header/Header';
import Footer from '../../../Components/Partials/Footer/Footer';
import { Link, useNavigate } from 'react-router-dom';
import config from "../../../Config/config.json";
import country_state from './country_state.json';
import $ from 'jquery';
import 'select2/dist/css/select2.min.css';
import 'select2';
import { ToastContainer, toast } from 'react-toastify';
import ScrollToTop from '../../ScrollToTop';


export default function BecomeSeller() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        phone_no: '',
        email: '',
        country_id: '',
        state_id: '',
        city_id: '',
        zip_code: '',
        store_email: '',
        paypal_email: '',
        termsAccepted: false,
        privacyAccepted: false,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [availableStates, setAvailableStates] = useState([]);

    const navigate = useNavigate();

    const countryRef = useRef(null);
    const stateRef = useRef(null);

    useEffect(() => {
        $(countryRef.current).on('change', (e) => {
            handleChange({ target: { name: 'country_id', value: e.target.value } });
        });

        $(stateRef.current).on('change', (e) => {
            handleChange({ target: { name: 'state_id', value: e.target.value } });
        });

        return () => {
            $(countryRef.current).off('change');
            $(stateRef.current).off('change');
        };
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'phone_no') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 13) {
                setFormData(prev => ({
                    ...prev,
                    [name]: cleaned
                }));
            }
            return;
        }

        if (name === 'country_id') {
            const selectedCountry = country_state.find(
                (country) => country.name === value
            );

            setAvailableStates(selectedCountry?.states || []);
            setFormData((prev) => ({
                ...prev,
                country_id: value,
                state_id: '',
                city_id: ''
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
    
        if (!formData.termsAccepted || !formData.privacyAccepted) {
            setError("You must accept both terms and privacy policies.");
            setLoading(false);
            return;
        }
    
        try {
            // Extract and exclude unwanted fields
            const {
                firstName,
                lastName,
                termsAccepted,
                privacyAccepted,
                ...rest
            } = formData;
    
            // Create the final payload
            const payload = {
                ...rest,
                name: `${firstName} ${lastName}`.trim()
            };
    
            console.log("Submitting payload:", payload); // 🔍 Debug check
    
            const response = await axios.post(`${config.API_URL_POST}/vendor-register`, payload);
    
            setMessage({
                type: 'success',
                text: 'Vendor registered successfully!',
                text_2: 'Your ID and Password have been sent to your email. Please check!',
            });
    
            setTimeout(() => {
                navigate('/verify-email');
            }, 1500);
        } catch (err) {
            console.error("API Error:", err.response?.data);
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <ScrollToTop/>
            <Header />
            <section className="login-sec">
                <div className="container h-100">
                    <div className="row justify-content-center align-items-center h-100">
                        <div className="col-xl-7 col-lg-7 col-md-8 col-12 my-5">
                            <div className="login-box">
                                <form onSubmit={handleSubmit}>
                                    <h2 className="mb-4">Become a Vendor</h2>
                                    <hr />
                                    {error && <p className="text-danger">{error}</p>}
                                    {message && <p className={`text-${message.type}`}>{message.text}</p>}
                                    {message && <p className={`text-${message.type}`}>{message.text_2}</p>}

                                    <div className='row'>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">First Name</label>
                                            <input
                                                type="text"
                                                name="firstName"
                                                className="form-control"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Last Name</label>
                                            <input
                                                type="text"
                                                name="lastName"
                                                className="form-control"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Phone Number</label>
                                            <input
                                                type="text"
                                                name="phone_no"
                                                className="form-control"
                                                value={formData.phone_no}
                                                onChange={handleChange}
                                                required
                                                maxLength={13}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                className="form-control"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Country/Region</label>
                                            <select
                                                name="country_id"
                                                className="form-select"
                                                value={formData.country_id}
                                                onChange={handleChange}
                                                required
                                                ref={countryRef}
                                            >
                                                <option value="">Select Country</option>
                                                {country_state.map((country) => (
                                                    <option key={country.code2} value={country.name}>
                                                        {country.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">State</label>
                                            <select
                                                name="state_id"
                                                className="form-select"
                                                value={formData.state_id}
                                                onChange={handleChange}
                                                required
                                                ref={stateRef}
                                            >
                                                <option value="">Select State</option>
                                                {availableStates.map((state) => (
                                                    <option key={state.code} value={state.name}>
                                                        {state.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">City</label>
                                            <input
                                                type="text"
                                                name="city_id"
                                                className="form-control"
                                                value={formData.city_id}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Zip Code</label>
                                            <input
                                                type="text"
                                                name="zip_code"
                                                className="form-control"
                                                value={formData.zip_code}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">Store Email</label>
                                            <input
                                                type="email"
                                                name="store_email"
                                                className="form-control"
                                                value={formData.store_email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label">PayPal Email (optional)</label>
                                            <input
                                                type="email"
                                                name="paypal_email"
                                                className="form-control"
                                                value={formData.paypal_email}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div className="col-12 mb-3 form-check d-flex gap-2 align-items-center">
                                            <input
                                                type="checkbox"
                                                name="termsAccepted"
                                                checked={formData.termsAccepted}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label className="form-check-label">
                                                I've read and accept the <Link to="/vendor-terms-conditions">Terms & Conditions</Link>
                                            </label>
                                        </div>
                                        <div className="col-12 mb-3 form-check d-flex gap-2 align-items-center">
                                            <input
                                                type="checkbox"
                                                name="privacyAccepted"
                                                checked={formData.privacyAccepted}
                                                onChange={handleChange}
                                                className="form-check-input"
                                            />
                                            <label className="form-check-label">
                                                I've read and accept the <Link to="/vendor-privacy-policy">Privacy Policy</Link>
                                            </label>
                                        </div>
                                    </div>

                                    <button className="form-control btn btn-primary w-auto py-2 px-4" type="submit" disabled={loading}>
                                        {loading ? 'Registering...' : 'Register as a Vendor'}
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

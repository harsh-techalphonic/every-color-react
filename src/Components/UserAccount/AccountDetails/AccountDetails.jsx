import React, { useState } from 'react';
import './AccountDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import config from "../../../Config/config.json";
import axios from 'axios';

export default function AccountDetails() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const [preview, setPreview] = useState('http://i.pravatar.cc/500?img=7');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    country: '',
    state: '',
    zip: ''
  });

  const togglePasswordVisibility = (field) => {
    switch (field) {
      case 'password':
        setShowPassword((prev) => !prev);
        break;
      case 'newPassword':
        setShowNewPassword((prev) => !prev);
        break;
      case 'confirmPassword':
        setShowConfirmPassword((prev) => !prev);
        break;
      default:
        break;
    }
  };

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
    if (confirmPassword && e.target.value !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    if (newPassword && e.target.value !== newPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const updateAccountAPI = async () => {
    const payload = {
      currentPassword: currentPassword || undefined,
      newPassword: (newPassword && confirmPassword && !passwordError) ? newPassword : undefined,
      profile: formData
    };

    const token = localStorage.getItem('token'); 

        axios.post(`${config.API_URL}/update-profile`, payload, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
  };

  const handleSave = async () => {
    try {
      const hasProfileChanges = Object.values(formData).some(val => val.trim() !== '');
      const hasPasswordChange = newPassword && confirmPassword && !passwordError;

      if (!hasProfileChanges && !hasPasswordChange) {
        alert('No changes to save.');
        return;
      }

      await updateAccountAPI();
      alert('Changes saved successfully!');
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('An error occurred while saving.');
    }
  };

  return (
    <div className='AccountDetails'>
      <div className='row'>
        <div className='col-lg-8'>
          <div className='card'>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>Your Profile</li>
            </ul>
            <div className='row'>
              <div className='col-lg-3'>
                <div className='col-lg-12 mb-3'>
                  <div className="avatar-upload">
                    <div className="avatar-edit">
                      <input
                        type="file"
                        id="imageUpload"
                        accept=".png, .jpg, .jpeg"
                        onChange={handleImageChange}
                      />
                      <label htmlFor="imageUpload"></label>
                    </div>
                    <div className="avatar-preview">
                      <div
                        id="imagePreview"
                        style={{
                          backgroundImage: `url(${preview})`,
                          display: 'block',
                          transition: 'opacity 0.65s ease-in-out',
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div className='col-lg-9'>
                <div className='card-body px-5'>
                  <div className='row'>
                    <div className='col-lg-6 mb-3'>
                      <label className='form-label'>First Name</label>
                      <input type='text' name="firstName" value={formData.firstName} onChange={handleInputChange} className='form-control' placeholder='First Name' />
                    </div>
                    <div className='col-lg-6 mb-3'>
                      <label className='form-label'>Last Name</label>
                      <input type='text' name="lastName" value={formData.lastName} onChange={handleInputChange} className='form-control' placeholder='Last Name' />
                    </div>
                    <div className='col-lg-6 mb-3'>
                      <label className='form-label'>Phone Number</label>
                      <input type='tel' name="phone" value={formData.phone} onChange={handleInputChange} className='form-control' placeholder='+1-202-555-0118' />
                    </div>
                    <div className='col-lg-6 mb-3'>
                      <label className='form-label'>Email Address</label>
                      <input type='email' name="email" value={formData.email} onChange={handleInputChange} className='form-control' placeholder='name@example.com' />
                    </div>
                    <div className='col-lg-12 mb-3'>
                      <label className='form-label'>Address</label>
                      <input type='text' name="address" value={formData.address} onChange={handleInputChange} className='form-control' placeholder='Address Details' />
                    </div>
                    <div className='col-lg-6 mb-3'>
                      <label className='form-label'>Country/Region</label>
                      <select name="country" value={formData.country} onChange={handleInputChange} className='form-select'>
                        <option value=''>Select Country</option>
                        <option value='India'>India</option>
                        <option value='USA'>USA</option>
                      </select>
                    </div>
                    <div className='col-lg-3 mb-3'>
                      <label className='form-label'>State</label>
                      <select name="state" value={formData.state} onChange={handleInputChange} className='form-select'>
                        <option value=''>Select State</option>
                        <option value='Delhi'>Delhi</option>
                        <option value='Maharashtra'>Maharashtra</option>
                      </select>
                    </div>
                    <div className='col-lg-3 mb-3'>
                      <label className='form-label'>Zip Code</label>
                      <input type='text' name="zip" value={formData.zip} onChange={handleInputChange} className='form-control' placeholder='120712' />
                    </div>
                  </div>

                  <div className='card mt-4'>
                    <ul className='list-group list-group-flush'>
                      <li className='list-group-item'>Change Password</li>
                    </ul>
                    <div className='card-body'>
                      <div className='row'>
                        <div className='col-lg-12 mb-3'>
                          <label className='form-label'>Current Password</label>
                          <div className='input-group'>
                            <input
                              type={showPassword ? 'text' : 'password'}
                              className='form-control'
                              placeholder='Current Password'
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                            <span className='input-group-text' onClick={() => togglePasswordVisibility('password')}>
                              <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                          </div>
                        </div>

                        <div className='col-lg-12 mb-3'>
                          <label className='form-label'>New Password</label>
                          <div className='input-group'>
                            <input
                              type={showNewPassword ? 'text' : 'password'}
                              className='form-control'
                              placeholder='New Password'
                              value={newPassword}
                              onChange={handlePasswordChange}
                            />
                            <span className='input-group-text' onClick={() => togglePasswordVisibility('newPassword')}>
                              <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                            </span>
                          </div>
                        </div>

                        <div className='col-lg-12 mb-3'>
                          <label className='form-label'>Confirm Password</label>
                          <div className='input-group'>
                            <input
                              type={showConfirmPassword ? 'text' : 'password'}
                              className='form-control'
                              placeholder='Confirm Password'
                              value={confirmPassword}
                              onChange={handleConfirmPasswordChange}
                            />
                            <span className='input-group-text' onClick={() => togglePasswordVisibility('confirmPassword')}>
                              <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                            </span>
                          </div>
                          {passwordError && <p className='text-danger'>{passwordError}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className='mt-4 profile-save_btn'>
                    <button type='button' onClick={handleSave}>Save Changes</button>
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

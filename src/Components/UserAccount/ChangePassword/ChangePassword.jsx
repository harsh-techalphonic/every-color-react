import React, { useState } from 'react';
import '../AccountDetails/AccountDetails.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import config from "../../../Config/config.json";
import axios from 'axios';
import { toast } from 'react-toastify';

export default function ChangePassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [current_password, setCurrentPassword] = useState('');
  const [new_password, setNewPassword] = useState('');
  const [new_password_confirmation, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const togglePasswordVisibility = (field) => {
    if (field === 'password') setShowPassword((prev) => !prev);
    if (field === 'new_password') setShowNewPassword((prev) => !prev);
    if (field === 'confirm_password') setShowConfirmPassword((prev) => !prev);
  };

  const handleNewPasswordChange = (e) => {
    const value = e.target.value;
    setNewPassword(value);

    if (new_password_confirmation && value !== new_password_confirmation) {
      setPasswordError('Passwords do not match');
      toast.error('Passwords do not match');
      console.error("Passwords do not match");
    } else {
      setPasswordError('');
    }
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);

    if (new_password && value !== new_password) {
      setPasswordError('Passwords do not match');
      toast.error('Passwords do not match');
      console.error("Passwords do not match");
    } else {
      setPasswordError('');
    }
  };

  const handleSave = async () => {
    try {
      if (!current_password || !new_password || !new_password_confirmation) {
        toast.error("All password fields are required.");
        console.error("All password fields are required.");
        return;
      }

      if (passwordError) {
        toast.error("Please fix password errors before saving.");
        console.error("Please fix password errors before saving.");
        return;
      }

      // ✅ Send all fields exactly as requested
      const payload = {
        current_password,
        new_password,
        new_password_confirmation
      };

      const token = localStorage.getItem('token');

      const response = await axios.post(
        `${config.API_URL}/user/change-password`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      toast.success("Password changed successfully!");
      console.log("Password changed successfully:", response.data);

      // Reset fields
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');

    } catch (error) {
      if (error.response) {
        toast.error("Error: " + error.response.data.message || "Something went wrong.");
        console.error("API error:", error.response.data);
      } else {
        toast.error("Network error: " + error.message);
        console.error("Network error:", error.message);
      }
    }
  };

  return (
    <div className='AccountDetails'>
      <div className='row'>
        <div className='col-lg-8'>
          <div className='card'>
            <ul className='list-group list-group-flush'>
              <li className='list-group-item'>Update Password</li>
            </ul>
            <div className='card-body px-5'>
              <div className='card mt-4'>
                <ul className='list-group list-group-flush'>
                  <li className='list-group-item'>Change Password</li>
                </ul>
                <div className='card-body'>
                  <div className='row'>

                    {/* Current Password */}
                    <div className='col-lg-12 mb-3'>
                      <label className='form-label'>Current Password</label>
                      <div className='input-group'>
                        <input
                          type={showPassword ? 'text' : 'password'}
                          className='form-control'
                          placeholder='Current Password'
                          value={current_password}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                        <span className='input-group-text' onClick={() => togglePasswordVisibility('password')}>
                          <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                        </span>
                      </div>
                    </div>

                    {/* New Password */}
                    <div className='col-lg-12 mb-3'>
                      <label className='form-label'>New Password</label>
                      <div className='input-group'>
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          className='form-control'
                          placeholder='New Password'
                          value={new_password}
                          onChange={handleNewPasswordChange}
                        />
                        <span className='input-group-text' onClick={() => togglePasswordVisibility('new_password')}>
                          <FontAwesomeIcon icon={showNewPassword ? faEyeSlash : faEye} />
                        </span>
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div className='col-lg-12 mb-3'>
                      <label className='form-label'>Confirm Password</label>
                      <div className='input-group'>
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          className='form-control'
                          placeholder='Confirm Password'
                          value={new_password_confirmation}
                          onChange={handleConfirmPasswordChange}
                        />
                        <span className='input-group-text' onClick={() => togglePasswordVisibility('confirm_password')}>
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
  );
}

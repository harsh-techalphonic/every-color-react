/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import config from "../../../Config/config.json";
import { AddAddress, API_URL, EditAddress } from "../../../Config/config";

const AddressModal = ({ 
  showModal, 
  handleCloseModal, 
  token, 
  editVal, 
  refreshAddresses 
}) => {
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [statedata, setStatedata] = useState([]);
  const [citydata, setCitydata] = useState([]);

  useEffect(() => {
    stateapi();
  }, []);

  useEffect(() => {
    if (state) {
      cityapi();
    }
  }, [state]);

  useEffect(() => {
    if (editVal && editVal.id) {
      setFullname(editVal.name || "");
      setPhonenumber(editVal.mobile || "");
      setAddress(editVal.full_address || "");
      setState(editVal.state || "");
      setCity(editVal.city || "");
      setZipcode(editVal.zip || "");
      setLandmark(editVal.landmark || "");
    } else {
      // Reset form when adding new address
      setFullname("");
      setPhonenumber("");
      setAddress("");
      setState("");
      setCity("");
      setZipcode("");
      setLandmark("");
    }
  }, [editVal, showModal]);

  const stateapi = async () => {
    try {
      const response = await axios.get(`${config.City_State_URL}states`, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("state data" , response)
      setStatedata(response.data);
    } catch (err) {
      console.error("Error fetching state data:", err);
    }
  };

  const cityapi = async () => {
  try {
    const response = await axios.get(
      `${config.City_State_URL}cities?state=${encodeURIComponent(state)}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    setCitydata(response.data);
  } catch (err) {
    console.error("Error fetching city data:", err);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    let form_data = {
      address_id: editVal?.id ? editVal.id : "",
      mobile: phonenumber,
      full_address: address,
      country: "India",
      city: city,
      state: state,
      zip: zipcode?.toString(),
      landmark: landmark,
      name: fullname,
    };

    try {
      const response = await axios.post(
        `${API_URL}${editVal?.id ? EditAddress : AddAddress}`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      
      if (refreshAddresses) {
        refreshAddresses();
      }
      
      handleCloseModal();
    } catch (err) {
      console.error("Error saving address:", err);
    }
  };

  if (!showModal) return null;

  return (
    <>
      <div className="modal d-block" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <form className="modal-content" method="POST" onSubmit={handleSubmit}>
            <div className="modal-header">
              <h5 className="modal-title">
                {editVal?.id ? "Edit Address" : "Add Address"}
              </h5>
              <button
                type="button"
                className="btn-close"
                onClick={handleCloseModal}
              ></button>
            </div>
            <div className="modal-body">
              <div className="row">
                <div className="col-lg-6 mb-3">
                  <label htmlFor="fullName" className="form-label">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-6 mb-3">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Enter 10-digit number"
                    maxLength={10}
                    value={phonenumber}
                    onChange={(e) =>
                      setPhonenumber(
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 10)
                      )
                    }
                    required
                  />
                </div>
                <div className="col-lg-12 mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Road No. 13/x, House no. 1320/C, Flat No. 5D"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>
                <div className="col-lg-8 mb-3">
                  <label htmlFor="landmark" className="form-label">
                    Landmark
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Landmark"
                    value={landmark}
                    onChange={(e) => setLandmark(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-4 mb-3">
                  <label htmlFor="state" className="form-label">
                    State
                  </label>
                  <select
                    className="form-select"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required
                  >
                    <option value="">Select State</option>
                    {statedata?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="col-lg-4 mb-3">
                  <label htmlFor="city" className="form-label">
                    City
                  </label>
                  <select
                    className="form-select"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                  >
                    <option value="">Select City</option>
                    {citydata?.map((item, index) => (
                      <option key={index} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div>
                
                
                
                <div className="col-lg-4 mb-3">
                  <label htmlFor="zipCode" className="form-label">
                    Zip Code
                  </label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Zip-code"
                    maxLength={6}
                    value={zipcode}
                    onChange={(e) =>
                      setZipcode(
                        e.target.value.replace(/[^0-9]/g, "").slice(0, 6)
                      )
                    }
                    required
                  />
                </div>
                
                
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary me-3"
                onClick={handleCloseModal}
              >
                Close
              </button>
              <button type="submit" className="btn btn-primary">
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
      <div className="modal-backdrop fade show"></div>
    </>
  );
};

export default AddressModal;
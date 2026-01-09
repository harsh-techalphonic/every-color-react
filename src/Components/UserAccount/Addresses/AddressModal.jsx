/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import axios from "axios";
import { AddAddress, API_URL, EditAddress } from "../../../Config/config";

const AddressModal = ({
  showModal,
  handleCloseModal,
  token,
  editVal,
  refreshAddresses,
}) => {
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [address, setAddress] = useState("");

  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [area, setArea] = useState("");

  // NEW: state & city lists based on ZIP API
  const [citydata, setCitydata] = useState([]);
  const [statedata, setStatedata] = useState([]);
  const [localitydata, setLocalitydata] = useState([]);

  // NEW: coordinates
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");
  const OPENCAGE_API_KEY = "cb0de6644faf4d018b50b37f629eda1c";

  useEffect(() => {
    if (editVal && editVal.id) {
      setFullname(editVal.name || "");
      setPhonenumber(editVal.mobile || "");
      setAddress(editVal.full_address || "");
      setState(editVal.state || "");
      setCity(editVal.city || "");
      setZipcode(editVal.zip || "");
      setLandmark(editVal.landmark || "");
      setArea(editVal.area || "");
    } else {
      setFullname("");
      setPhonenumber("");
      setAddress("");
      setState("");
      setCity("");
      setZipcode("");
      setLandmark("");
      setArea("");
    }
  }, [editVal, showModal]);

  // ⛔ REMOVED: stateapi()
  // ⛔ REMOVED: cityapi()

  // ------------------------------------
  // ⭐ ZIP API CALL WHEN ZIP ENTERED
  // ------------------------------------
  useEffect(() => {
    if (zipcode.length === 6) {
      zipCode();
    }
  }, [zipcode]);

  const zipCode = async () => {
    try {
      if (!zipcode || zipcode.trim().length < 6) {
        alert("❌ Please enter a valid 6-digit Zip Code");
        return;
      }

      const response = await axios.get(
        `https://dhanbet9.co/api/get-cities?postcode=${zipcode.trim()}`
      );

      console.log("zipcode api response ", response);

      const data = response?.data?.data?.postcode_details;
      setLocalitydata(data?.locality);

      console.log("zipcode api response city ", data);
      if (!data) {
        return;
      }

      setCitydata(data.city ? [data.city] : []);
      setStatedata(data.state ? [data.state] : []);
      setCity(data.city || "");
      setState(data.state || "");
    } catch (err) {
      console.error("Error fetching city/state:", err);
      alert("❌ Unable to fetch zip code details");
    }
  };

  // ------------------------------------
  // GEOCODE
  // ------------------------------------
  const getCoordinates = async (fullAddress) => {
    setError("");
    setCoords(null);

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: { q: fullAddress, key: OPENCAGE_API_KEY },
        }
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setCoords({ lat, lng });
        return { lat, lng };
      } else {
        setError("No coordinates found");
        return null;
      }
    } catch (err) {
      setError("Error fetching coordinates");
      return null;
    }
  };

  // ------------------------------------
  // SUBMIT HANDLER
  // ------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();

    const fullAddress = `${address} ${landmark} ${city} ${state} ${zipcode} India`;
    const geoCoords = await getCoordinates(fullAddress);

    if (!geoCoords) {
      alert("Could not fetch coordinates. Try again.");
      return;
    }

    let form_data = {
      address_id: editVal?.id ? editVal.id : "",
      mobile: phonenumber,
      full_address: address,
      country: "India",
      city: city,
      state: state,
      zip: zipcode?.toString(),
      landmark: landmark,
      area: area,
      name: fullname,
      latitude: geoCoords.lat,
      longitude: geoCoords.lng,
    };

    try {
      await axios.post(
        `${API_URL}${editVal?.id ? EditAddress : AddAddress}`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      refreshAddresses?.();
      handleCloseModal();
    } catch (err) {
      console.error("Error saving address:", err);
      alert("Failed to save. Try again later.");
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
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    required
                  />
                </div>

                <div className="col-lg-6 mb-3">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
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

                {/* Other inputs remain same */}
                <div className="col-lg-12 mb-3">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  />
                </div>

                {/* Zip Code */}
                <div className="col-lg-4 mb-3">
                  <label className="form-label">Zip Code</label>
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

                {/* Auto-filled State */}
                {/* Auto-filled State */}
                <div className="col-lg-4 mb-3">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    required disabled
                  />
                </div>

                {/* Auto-filled City */}
                <div className="col-lg-4 mb-3">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required disabled
                  />
                </div>


                 <div className="col-lg-4 mb-3">
                  <label className="form-label">Area/Locality</label>
                  <input
                    type="text"
                    className="form-control"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required 
                  />
                </div>

                {/* Area/Locality */}
                {/* <div className="col-lg-6 mb-3">
                  <label className="form-label">Area/Locality</label>
                  <select
                    className="form-select"
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    required
                  >
                    <option value="">Select Locality</option>
                    {localitydata?.map((item, i) => (
                      <option key={i} value={item}>
                        {item}
                      </option>
                    ))}
                  </select>
                </div> */}
                <div className="col-lg-6 mb-3">
                  <label className="form-label">Landmark</label>
                  <input
                    type="text"
                    className="form-control"
                    value={landmark} 
                    onChange={(e) => setLandmark(e.target.value)}
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

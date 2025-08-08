import React, { useState, useEffect } from "react";
import "./Addresses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "../../../Config/config.json";

export default function Addresses() {
  const [showModal, setShowModal] = useState(false);
  const [gettoken, setGettoken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("India");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [statedata, setStatedata] = useState([]);
  const [citydata, setCitydata] = useState([]);
  const [addreddAdded, setAddreddAdded] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);
  }, []);

  const token = gettoken;

  useEffect(() => {
    fetchData();
    fetchStates();
    if (state) {
      fetchCities();
    }
  }, [token, addreddAdded, state]);

  const fetchData = async () => {
    try {
      const response = await axios.get(`${config.API_URL}/order/get-address`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setData(response.data);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchStates = async () => {
    try {
      const response = await axios.get(`${config.City_State_URL}/state`);
      setStatedata(response.data.state || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const fetchCities = async () => {
    try {
      const response = await axios.post(`${config.City_State_URL}/city`, {
        state: state,
      });
      consolor  
      setCitydata(response.data.cities || []);
    } catch (err) {
      setError(err.message);
    }
  };

  const delete_address = async (item) => {
    if (window.confirm("Are you sure you want to delete this address?")) {
      try {
        const response = await axios.post(
          `${config.API_URL}/order/remove-address`,
          { address_id: item.id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.data.status) {
          alert("Address deleted successfully!");
          fetchData();
        } else {
          alert(response.data.message || "Failed to delete address.");
        }
      } catch (err) {
        alert("Error deleting address.");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form_data = {
      name: fullname,
      mobile: phonenumber,
      email: email,
      full_address: address,
      country: country,
      state: state,
      city: city,
      zip: zipcode,
      landmark: landmark,
    };

    try {
      const response = await axios.post(
        `${config.API_URL}/order/add-address`,
        form_data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      setAddreddAdded(response.data);
      setShowModal(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <div className="addresss_Box">
        <div className="row">
          <div className="col-lg-12">
            <div className="MultipleAddress">
              <div className="row">
                <div className="col-lg-4 mb-3">
                  <div className="Add_addressS">
                    <a href="#!" onClick={() => setShowModal(true)}>
                      <div className="Icon_box">
                        <img src="/plus_icon.png" alt="Add Address" />
                      </div>
                      <div className="Add_address_btn mt-3">
                        <button type="button">Add Address</button>
                      </div>
                    </a>
                  </div>
                </div>

                {data?.data?.map((item) => (
                  <div className="col-lg-4 mb-3" key={item.id}>
                    <div className="AddressBox_one">
                      <h4>Billing Address</h4>
                      <h5>{item.name}</h5>
                      <p>
                        {item.full_address}, {item.landmark}, {item.city},{" "}
                        {item.state}, {item.country} - {item.zip}
                      </p>
                      <button onClick={() => setShowModal(true)}>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                      <button
                        className="delete_btn"
                        onClick={() => delete_address(item)}
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <>
          <div className="modal d-block" tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <form className="modal-content" onSubmit={handleSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Add Address</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="row">
                    <div className="col-lg-12 mb-3">
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full Name"
                        onChange={(e) => setFullname(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Phone Number</label>
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

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Email address</label>
                      <input
                        type="email"
                        className="form-control"
                        placeholder="name@example.com"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">State</label>
                      <select
                        className="form-select"
                        defaultValue=""
                        onChange={(e) => setState(e.target.value)}
                        required
                      >
                        <option disabled value="">
                          Select State
                        </option>
                        {statedata?.map((item) => (
                          <option key={item.id} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">City</label>
                      <select
                        className="form-select"
                        defaultValue=""
                        onChange={(e) => setCity(e.target.value)}
                        required
                      >
                        <option disabled value="">
                          Select City
                        </option>
                        {citydata?.map((item, i) => (
                          <option key={i} value={item.name}>
                            {item.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-lg-6 mb-3">
                      <label className="form-label">Landmark</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Landmark"
                        onChange={(e) => setLandmark(e.target.value)}
                        required
                      />
                    </div>

                    <div className="col-lg-6 mb-3">
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

                    <div className="col-lg-12 mb-3">
                      <label className="form-label">Address</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Full address"
                        onChange={(e) => setAddress(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary me-3"
                    onClick={() => setShowModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Address
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </>
  );
}

import React, { useState, useEffect } from "react";
import "./Addresses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import axios from "axios";
import config from "../../../Config/config.json";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Addresses() {
  const [showModal, setShowModal] = useState(false);
  const [gettoken, setGettoken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [fullname, setFullname] = useState("");
  const [phonenumber, setPhonenumber] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [city, setCity] = useState("");
  const [landmark, setLandmark] = useState("");
  const [statedata, setStatedata] = useState("");
  const [citydata, setCitydata] = useState([]);
  const [addreddAdded, setAddreddAdded] = useState("");
  // console.log("data get api", data?.data);
  useEffect(() => {
    const token = localStorage.getItem("token");
    setGettoken(token);
    // setIsLoggedIn(!!token);
  }, []);

  const handleOpenAddrModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseAddrModal = () => setShowModal(false);

  // Replace with your actual token

  const token = gettoken;
  // "eyJpdiI6InAvczZTUlVzNmNvamZHaExuV3Blamc9PSIsInZhbHVlIjoib3UzNFg0bC83cmovS0hRajlPUDdvQT09IiwibWFjIjoiZjZlZTZjNjI0YWI1MGIwMjdmZjc4Njk0MmEyYjBhOWIwODRjZjZkODM1YTliY2VmYTEwYjNkZDFhNTJkZTczZiIsInRhZyI6IiJ9";

  useEffect(() => {
    fetchData();
    stateapi();
    if (state) {
      cityapi();
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
      console.log("response get api", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  const stateapi = async () => {
    try {
      const response = await axios.get(`${config.City_State_URL}state`, {
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setStatedata(response.data.state);
      console.log("response get state", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  const cityapi = async () => {
    try {
      const response = await axios.post(`${config.City_State_URL}city`, {
        state: state,
        headers: {
          // Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      setCitydata(response.data.cities);
      console.log("response get city", response.data);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  const delete_address = async (id) => {
    console.log("delete-address", id?.id);
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (confirmed) {
      try {
        const response = await axios.post(
          `${config.API_URL}/order/remove-address`,
          {
            address_id: id?.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.status) {
          console.log("delete-response", response);
          alert("Address deleted successfully!");
          fetchData(); // refresh UI or list
        } else {
          alert(response?.data?.message || "Failed to delete address.");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("An error occurred while deleting the address.");
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("error", error);
    console.log("fullname", fullname);
    console.log("phonenumber", phonenumber);
    console.log("email", email);
    console.log("address", address);
    console.log("country", country);
    console.log("state", state);
    console.log("zipcode", zipcode);  

    let form_data = {
      mobile: phonenumber,
      full_address: address,
      country: country,
      city: city,
      state: statedata,
      zip: zipcode,
      landmark: landmark,
      name: fullname,
    };
    const postData = async () => {
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
        handleCloseAddrModal();
        console.log("response get api", response.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };
    postData();
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
                    <a href="#!" onClick={handleOpenAddrModal}>
                      <div className="Icon_box">
                        <img src="/plus_icon.png" alt="Add Address" />
                      </div>
                      <div className="Add_address_btn mt-3">
                        <button type="button">Add Address</button>
                      </div>
                    </a>
                  </div>
                </div>

                {data?.data?.map((item,index) => (
                  <div className="col-lg-4 mb-3" key={index}>
                    <div className="AddressBox_one">
                      <h4>Billing Address</h4>
                      <h5>{item?.name}</h5>
                      <p>
                        {item?.full_address} {item?.landmark} {item?.state}{" "}
                        {item?.country}
                      </p>
                      <button onClick={handleOpenAddrModal}>
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
        <div className="modal d-block" tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg	">
            <form
              className="modal-content"
              method="POST"
              onSubmit={handleSubmit}
            >
              <div className="modal-header">
                <h5 className="modal-title">Add Address</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={handleCloseAddrModal}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-lg-12 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Full Name"
                      onChange={(e) => setFullname(e.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="col-lg-6 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="exampleFormControlInput1"
                      placeholder="Last Name"
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div> */}
                  <div className="col-lg-6 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
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
                  <div className="col-lg-6 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Email address
                    </label>
                    <input
                      type="email"
                      className="form-control"
                      placeholder="name@example.com"
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                    <div className="col-lg-6 mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      State
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <option disabled selected value="">
                        Open this select menu
                      </option>
                      {statedata?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      City
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setCity(e.target.value)}
                      required
                    >
                      <option disabled selected value="">
                        Open this select menu
                      </option>
                      {citydata?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-lg-8 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Landmark
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Landmark"
                      onChange={(e) => setLandmark(e.target.value)}
                      required
                    />
                  </div>
                  <div className="col-lg-4 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
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
                  <div className="col-lg-12 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Road No. 13/x, House no. 1320/C, Flat No. 5D"
                      onChange={(e) => setAddress(e.target.value)}
                      required
                    />
                  </div>
                  {/* <div className="col-lg-6 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      Country/Region
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setCountry(e.target.value)}
                      required
                    >
                      <option selected disabled value="">
                        Open this select menu
                      </option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div> */}
                  {/* <div className="col-lg-3 mb-3">
                    <label
                      htmlFor="exampleFormControlInput1"
                      className="form-label"
                    >
                      State
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <option disabled selected value="">
                        Open this select menu
                      </option>
                      {statedata?.map((item) => (
                        <option key={item.id} value={item.name}>
                          {item}
                        </option>
                      ))}
                    </select>
                  </div> */}
                  {/* <div className="col-lg-3 mb-3">
                    <label
                      for="exampleFormControlInput1"
                      className="form-label"
                    >
                      State
                    </label>
                    <select
                      className="form-select"
                      aria-label="Default select example"
                      onChange={(e) => setState(e.target.value)}
                      required
                    >
                      <option selected disabled value="">
                        Open this select menu
                      </option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div> */}
                
                  
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary me-3"
                  onClick={handleCloseAddrModal}
                >
                  Close
                </button>
                <button type="submit" className="btn btn-secondary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
}

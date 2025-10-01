import React, { useState, useEffect } from "react";
import "./Addresses.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import config from "../../../Config/config.json";
import AddressModal from "./AddressModal";

export default function Addresses() {
  const [showModal, setShowModal] = useState(false);
  const [token, setToken] = useState(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [editVal, setEditVal] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

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
      console.error("Error fetching data:", err);
      setError(err.message);
    }
  };

  const handleOpenModal = (address = null) => {
    setEditVal(address);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditVal(null);
  };

  const delete_address = async (address) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (confirmed) {
      try {
        const response = await axios.post(
          `${config.API_URL}/order/remove-address`,
          {
            address_id: address.id,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response?.data?.status) {
          alert("Address deleted successfully!");
          fetchData();
        } else {
          alert(response?.data?.message || "Failed to delete address.");
        }
      } catch (error) {
        console.error("Error deleting address:", error);
        alert("An error occurred while deleting the address.");
      }
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
                    <a href="#!" onClick={() => handleOpenModal()}>
                      <div className="Icon_box">
                        <img src="/plus_icon.png" alt="Add Address" />
                      </div>
                      <div className="Add_address_btn mt-3">
                        <button type="button">Add Address</button>
                      </div>
                    </a>
                  </div>
                </div>

                {data?.data?.map((item, index) => (
                  <div className="col-lg-4 mb-3" key={index}>
                    <div className="AddressBox_one">
                      <h4>Billing Address</h4>
                      <h5>{item?.name}</h5>
                      <p>
                        {item?.full_address} {item?.landmark} {item?.state}{" "}
                        {item?.country}
                      </p>

                      <div className="address_actions">
                        <button
                          onClick={() => handleOpenModal(item)}
                          className="edit_btn"
                        >
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
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AddressModal
        showModal={showModal}
        handleCloseModal={handleCloseModal}
        token={token}
        editVal={editVal}
        refreshAddresses={fetchData}
      />
    </>
  );
}

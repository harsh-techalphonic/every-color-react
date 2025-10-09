import React, { useState } from "react";
import axios from "axios";

export default function GeocodeDemo() {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState(null);
  const [error, setError] = useState("");

  const OPENCAGE_API_KEY = "cb0de6644faf4d018b50b37f629eda1c"; // replace with your key

  const getCoordinates = async () => {
    setError("");
    setCoords(null);

    if (!address.trim()) {
      setError("Please enter an address");
      return;
    }

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json`,
        {
          params: {
            q: address,
            key: OPENCAGE_API_KEY,
          },
        }
      );

      if (response.data.results.length > 0) {
        const { lat, lng } = response.data.results[0].geometry;
        setCoords({ lat, lng });
      } else {
        setError("No coordinates found for this address");
      }
    } catch (err) {
      setError("Error fetching coordinates");
      console.error(err);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", textAlign: "center" }}>

      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        placeholder="Enter address (e.g., Hyderabad, India)"
        style={{
          padding: "10px",
          width: "80%",
          marginBottom: "10px",
          border: "1px solid #ccc",
          borderRadius: "6px",
        }}
      />
      <br />

      <button
        onClick={getCoordinates}
        style={{
          padding: "10px 20px",
          border: "none",
          borderRadius: "6px",
          background: "#007bff",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        Get Coordinates
      </button>

      {coords && (
        <div style={{ marginTop: "20px" }}>
          <h4>Coordinates:</h4>
          <p>
            Latitude: <b>{coords.lat}</b> <br />
            Longitude: <b>{coords.lng}</b>
          </p>
        </div>
      )}

      {error && <p style={{ color: "red", marginTop: "20px" }}>{error}</p>}
    </div>
  );
}

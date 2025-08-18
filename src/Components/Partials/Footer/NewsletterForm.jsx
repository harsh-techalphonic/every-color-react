import React, { useState } from "react";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export default function NewsletterForm({ simple = false }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email!");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        "https://dimgrey-eel-688395.hostingersite.com/api/web/send-newslatter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message || "Subscribed successfully!");
        setEmail("");
      } else {
        toast.info(result.message || "Something went wrong!");
      }
    } catch (error) {
      toast.error("Failed to subscribe. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={simple ? "" : "d-flex align-items-center position-relative"}
      onSubmit={handleSubmit}
    >
      <input
        type="email"
        placeholder="Enter your email"
        className="form-control px-4 py-3 rounded-rounded text-black flex-grow-1"
        value={email}
        maxLength="50"
        onChange={(e) => setEmail(e.target.value)}
        disabled={loading}
      />
      <button
        type="submit"
        className={simple ? "bt" : "px-4 py-3 border-0 font-semibold position-absolute top-0 end-0"}
        disabled={loading}
      >
        {loading ? "..." : simple ? "Subscribe" : <FontAwesomeIcon icon={faPaperPlane} /> }
      </button>
    </form>
  );
}

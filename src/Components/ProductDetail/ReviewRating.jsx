import React, { useState, useEffect } from 'react';
import "./ReviewRating.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import config from '../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import { useSelector } from "react-redux";

export default function ReviewRating({ singleProduct }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [formData, setFormData] = useState({ comment: '', image: null });
  const [reviews, setReviews] = useState([]);

  const orders = useSelector((store) => store.orders.orders);

  useEffect(() => {
    setReviews(singleProduct.reviews || []);
  }, [singleProduct]);

  const handleStarClick = (value) => {
    setSelectedRating(value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      toast.info("Please login first to submit a review.");
      window.location.href = '/login';
      return;
    }

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("product_id", singleProduct.id);
      formDataToSend.append("star", selectedRating);
      formDataToSend.append("description", formData.comment);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${config.API_URL_POST}/review/add-review`,
        formDataToSend,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        const newReview = {
          id: Date.now(),
          rating: selectedRating,
          description: formData.comment,
          created_at: new Date().toISOString(),
          user: { name: "You" },
          img: formData.image ? URL.createObjectURL(formData.image) : null,
        };

        setReviews([newReview, ...reviews]);
        toast.success("Thank you! Your review was submitted.");
        setShowModal(false);
        setFormData({ comment: '', image: null });
        setSelectedRating(0);
      } else {
        toast.error("Something went wrong: " + response.data.message);
      }
    } catch (error) {
      console.error("Network error details:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const averageRating = reviews.length
    ? (
        reviews.reduce((acc, review) => acc + (review.rating || review.star || 0), 0) 
        / reviews.length
      ).toFixed(1)
    : "0.0";

  const StarRating = ({ rating }) => (
    <span className='rating-reviwe mb-4'>
      {[...Array(5)].map((_, index) => (
        <FontAwesomeIcon
          key={index}
          icon={index < rating ? faSolidStar : faRegularStar}
          style={{ color: '#FFD700', marginBottom: "8px" }}
        />
      ))}
    </span>
  );

  const token = localStorage.getItem("token");
  const isLoggedIn = !!token;

  const hasPurchased = orders?.some(order =>
    order.products?.some(p => p.product_id === singleProduct.id)
  );

  return (
    <>
      <ToastContainer />
      <div className='reviewer-sec'>
        <div className='container'>
          <div className='reviewer-main-box'>
            <div className='tititle d-flex align-items-center justify-content-between p-4'>
              <h3>
                All Reviews ({reviews.length})
                <span> {averageRating} <FontAwesomeIcon icon={faSolidStar} /></span>
              </h3>

              {!isLoggedIn ? (
                <button
                  className="btn btn-primary"
                  onClick={() => (window.location.href = "/login")}
                >
                  Login
                </button>
              ) : !hasPurchased ? (
                <button
                  className="btn btn-primary"
                  onClick={() => (window.location.href = "/shop")}
                >
                  Order Now
                </button>
              ) : (
                <button
                  className="btn btn-primary"
                  onClick={() => setShowModal(true)}
                >
                  Write a review
                </button>
              )}
            </div>

            {reviews.length === 0 ? (
              <p className="text-center p-4">No reviews yet. Be the first to review!</p>
            ) : (
              reviews.map((review) => (
                <div key={review.id} className="review-card">
                  <div className='d-flex align-items-top gap-4'>
                    <div className='reviewr-img'>
                      {review.image ? (
                        <img src={review.image} alt={`${review.user?.name || "User"}'s review`} />
                      ) : (
                        <span>{review.user?.name ? review.user.name.slice(0, 2).toUpperCase() : "AN"}</span>
                      )}
                    </div>
                    <div className='reviewer-content'>
                      <h4>{review.user?.name || "Anonymous"}</h4>
                      <StarRating rating={review.rating || review.star || 0} />
                      <p className='revicw-date'>{new Date(review.created_at).toLocaleDateString()}</p>
                      <p>{review.description || review.review_msg}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div className="modal-content">
              <form onSubmit={handleSubmit}>
                <div className="modal-header d-flex align-items-center justify-content-between">
                  <h5 className="modal-title">Write a Review</h5>
                  <button type="button" className="close" onClick={() => setShowModal(false)}>&times;</button>
                </div>
                <div className="modal-body">
                  <div id="rating" className="mb-3 d-flex gap-1">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <svg
                        key={val}
                        className="star"
                        onClick={() => handleStarClick(val)}
                        viewBox="0 12.705 512 486.59"
                        style={{
                          fill: val <= selectedRating ? "#f39c12" : "gray",
                          width: "30px",
                          cursor: "pointer"
                        }}
                      >
                        <polygon points="256.814,12.705 317.205,198.566 512.631,198.566 354.529,313.435 414.918,499.295 256.814,384.427 98.713,499.295 159.102,313.435 1,198.566 196.426,198.566"></polygon>
                      </svg>
                    ))}
                  </div>

                  <div className="form-group mb-3">
                    <label>Your Review:</label>
                    <textarea
                      className="form-control"
                      rows="4"
                      name="comment"
                      value={formData.comment}
                      onChange={handleInputChange}
                      maxLength={999}
                      required
                    />
                    <small className="form-text text-muted">
                      {999 - formData.comment.length} characters remaining
                    </small>
                  </div>

                  <div className="form-group mb-3">
                    <label>Upload Image (optional):</label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Submit Review</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

import React, { useState, useEffect } from 'react';
import "./ReviewRating.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as faSolidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faRegularStar } from '@fortawesome/free-regular-svg-icons';
import config from '../../Config/config.json';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function ReviewRating({ singleProduct }) {
  const [showModal, setShowModal] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [formData, setFormData] = useState({ comment: '' });
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    setReviews(singleProduct.reviews || []);
  }, [singleProduct]);

  const handleStarClick = (value) => {
    setSelectedRating(value);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');

    if (!token) {
      toast.info("Please login first to submit a review.");
      window.location.href = '/login';
      return;
    }

    const reviewData = {
      id: singleProduct.id,
      rating: selectedRating,
      comment: formData.comment,
    };

    try {
      const response = await axios.post(
        `${config.API_URL_POST}/product-review`,
        reviewData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const newReview = {
          id: Date.now(), // Ideally use response.data.id
          rating: selectedRating,
          review_msg: formData.comment,
          created_at: new Date().toISOString(),
          user: {
            name: "You", // Ideally get from logged-in user
          },
          img: null,
        };

        setReviews([newReview, ...reviews]); // Real-time update
        toast.success("Thank you! Your review was submitted.");
        setShowModal(false);
        setFormData({ comment: '' });
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
    ? (reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length).toFixed(1)
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
              <button className="btn btn-primary" onClick={() => setShowModal(true)}>Write a review</button>
            </div>

            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className='d-flex align-items-top gap-4'>
                  <div className='reviewr-img'>
                    {review.img ? (
                      <img src={review.img} alt={`${review.user.name}'s review`} />
                    ) : (
                      <span>{review.user.name.slice(0, 2).toUpperCase()}</span>
                    )}
                  </div>
                  <div className='reviewer-content'>
                    <h4>{review.user.name}</h4>
                    <StarRating rating={review.rating} />
                    <p className='revicw-date'>{new Date(review.created_at).toLocaleDateString()}</p>
                    <p>{review.review_msg}</p>
                  </div>
                </div>
              </div>
            ))}
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
                  <div className="form-group">
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

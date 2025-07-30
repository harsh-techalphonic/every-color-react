import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './TestimonialCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons'; // for unfilled stars

export const TestimonialCard = ({ TestimonialContent, Username, Rating, Image }) => {
  const renderStars = () => {
    const stars = [];
    const maxStars = 5;
    for (let i = 1; i <= maxStars; i++) {
      stars.push(
        <span key={i}>
          <FontAwesomeIcon icon={i <= Rating ? solidStar : regularStar} />
        </span>
      );
    }
    return stars;
  };

  return (
    <div className="testimonial-slider">
        <div className='testimonial-card'>
        <div className="card border-0 ">
            <div className="card-body testimonial-card-body rounded-3">
            <div className="testimonnial-card d-flex align-items-center gap-3">
                <div className="user-img">
                    <img src={Image} alt="" className='rounded-circle' />
                </div>
                <div className="testimonial-content ms-3">
                    <div className="testimonial-description">
                        <p>{TestimonialContent}</p>
                    </div>
                    <div className="username">
                        <h6>{Username}</h6>
                    </div>
                    <div className="rating">
                        {renderStars()}
                    </div>
                </div>
            </div>
            </div>
        </div>
        </div>
    </div>
  );
};

import React from 'react';
import Slider from "react-slick";
import './Testimonial.css';
import { TestimonialCard } from './TestimonialCard/TestimonialCard';
import TestimonialApi from '../../../API/TestimonialApi';
import { useSelector } from "react-redux";

const TestimonialSlider = () => {
  const testimonials = useSelector((store) => store.testimonials);
  // console.log("Redux testimonials:", testimonials);

  // Convert testimonials object to array if data exists
  const testimonialsArray = testimonials?.data
    ? Object.values(testimonials.data)
    : [];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
    centerMode: true,
    centerPadding: "180px",
    responsive: [
      {
        breakpoint: 1740,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "60px",
        }
      },
      {
        breakpoint: 1640,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          centerPadding: "100px",
        }
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "60px",
        }
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 1,
          centerMode: true,
          centerPadding: "0px",
        }
      }
    ],
  };

  return (
    <>
      <TestimonialApi />
      <div className='testmonial my-5 py-lg-5 py-md-4 py-2'>
        <div className="container-fluid">
          <div className="text-center mb-5">
            <h2 className="fw-bold mb-2">Testimonials</h2>
            <p className="text-muted mb-0">
              Discover exceptional experiences through testimonials from our satisfied customers.
            </p>
          </div>

          {testimonialsArray.length > 0 && (
            <Slider {...settings}>
              {testimonialsArray.map((testimonial, idx) => (
                <TestimonialCard
                  key={idx}
                  TestimonialContent={testimonial.content}
                  Username={testimonial.heading}
                  Rating={testimonial.star}
                  Image={testimonial.image}
                />
              ))}
            </Slider>
          )}
        </div>
      </div>
    </>
  );
};

export default TestimonialSlider;

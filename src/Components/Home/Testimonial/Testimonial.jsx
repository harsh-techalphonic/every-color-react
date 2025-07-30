import React from 'react';
import Slider from "react-slick";
import './Testimonial.css'
import { TestimonialCard } from './TestimonialCard/TestimonialCard';

const TestimonialSlider = () => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: false,
      autoplay: true,
       autoplaySpeed: 1000,
    centerMode: true,
    centerPadding: "100px",
    responsive: [
      
      {
        breakpoint: 1600,
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
      }
    ],
  };
  const testimonialsData =[
  {
    "Image":"https://randomuser.me/api/portraits/men/14.jpg",
    "TestimonialContent": "Working with Bytewave has been an absolute game-changer for our online presence. Their innovative strategies and creative approach have taken our brand to new heights!",
    "Username": "Benjamin Parker",
    "Rating": 5
  },
  { 
    "Image":"https://randomuser.me/api/portraits/men/14.jpg",
    "TestimonialContent": "I'm truly impressed by the results delivered by Bytewave. Their team's professionalism and dedication shine through in every project.",
    "Username": "Sophia Martinez",
    "Rating": 4
  },
  {
     "Image":"https://randomuser.me/api/portraits/men/14.jpg",
    "TestimonialContent": "I can't thank Bytewave enough for their exceptional service. From web design to social media management, they've exceeded our expectations every step of the way.",
    "Username": "James Chen",
    "Rating": 5
  },
  {
     "Image":"https://randomuser.me/api/portraits/men/14.jpg",
    "TestimonialContent": "Choosing Bytewave was the best decision we made for our business. Their expertise in SEO and digital marketing has significantly boosted our traffic and conversions.",
    "Username": "Aarav Sharma",
    "Rating": 3
  }
]

  return (
    <div className='testmonial my-5 py-lg-5 py-md-4 py-2'>
      <div className="container-fluid">
        <div className="text-center mb-5">
          <h2 className="fw-bold mb-2">Testimonials</h2>
          <p className="text-muted mb-0">
            Discover exceptional experiences through testimonials from our satisfied customers.
          </p>
        </div>
        
          <Slider {...settings}>
            {testimonialsData.map((testimonial, idx) => (
            <TestimonialCard key={idx}
                TestimonialContent={testimonial.TestimonialContent}
                Username={testimonial.Username}
                Rating={testimonial.Rating}
                Image={testimonial.Image} />
            ))}
          </Slider>
      </div>
    </div>
  );
};

export default TestimonialSlider;

import React from 'react'
import './Press.css' 
import Slider from 'react-slick'
import PressApi from '../../../API/PressApi';
import { useSelector } from 'react-redux';

export default function Press() {

const press = useSelector((store) => store.press);
  console.log("Redux testimonials:", press);

  // Convert testimonials object to array if data exists
  const pressData = press?.data
    ? Object.values(press.data)
    : [];
    console.log("pressData", pressData)


    const settings = {
    dots: false,
    infinite: true,
    speed: 800,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
  };
 
//   const pressData =[
//   {
//     "Image":"https://randomuser.me/api/portraits/men/14.jpg",
//     "pressContent": "Working with Bytewave has been an absolute game-changer for our online presence. Their innovative strategies and creative approach have taken our brand to new heights!",

//   },
//   { 
//     "Image":"https://randomuser.me/api/portraits/men/14.jpg",
//     "pressContent": "The team at Bytewave is highly professional, responsive, and genuinely cares about our business growth. We’ve seen incredible results.",

//   },
//   {
//      "Image":"https://randomuser.me/api/portraits/men/14.jpg",
//     "pressContent": "Bytewave’s attention to detail and strategic mindset exceeded our expectations. Would definitely recommend them to anyone serious about scaling online.",

//   },
//   {
//      "Image":"https://randomuser.me/api/portraits/men/14.jpg",
//     "pressContent": "It’s rare to find a team that combines creativity with performance so effectively. Bytewave nailed it.",

//   }
// ]
  return (
    <>
    <PressApi/>
   
    <div className='prss_sec pt-lg-5 mt-4'>
      <div className="container">
        <div className="row align-items-center">
          
          <div className="col-md-6 mb-4">
              <div className="Press-content">
            <h2 className="fw-bold">
              In the <span className="text-dark fw-bolder">Press</span>
            </h2>
            <p className="text-muted small mb-1">
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
              turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
              nec fringilla accumsan, risus sem.
            </p>
            <p className="text-muted small mb-1">
              Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu
              turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus
              nec fringilla accumsan, risus sem.
            </p>
            </div>
          </div>
          
          <div className="col-md-6">
            <Slider {...settings}>
              {pressData.map((press,index) =>(
              <div className="text-center" key={index}>
                <div className="Press-img mb-3">
                  <img src={press.image} alt="slide 1" />
                </div>
                <div className="bg-light p-4">
                  <div className="Quote-icon mb-2">
                    <img src="press_quote.png" alt="quote" />
                  </div>
                  <p className="text-muted mb-0 small">
                    {press.content}
                  </p>
                </div>
              </div>
              ))}
            </Slider>
          </div>

        </div>
      </div>
    </div>
     </>
  )
}

import React, { useEffect } from "react";
import "./Hero.css";
import Slider from "react-slick";
import axios from "axios";
import config from "../../../Config/config.json";
import { useDispatch, useSelector } from "react-redux";
import { bannersAction } from "../../../store/HomesSection/bannerSlice";

export default function Hero() {
  const banners = useSelector((store) => store.banners);
  const dispatch = useDispatch();

  useEffect(() => {
    if (banners.status) return;

    axios
      .get(`${config.API_URL}/web/section/home-banner-desktop`)
      .then((response) => {
       
        dispatch(bannersAction.getCategory(response.data));
      })
      .catch((error) => {
        console.error(error);
      });
  }, [banners.status, dispatch]);

  const settings = {
    dots: true,
    infinite: banners.data.length > 1, // prevent looping if only 1 banner
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    swipeToSlide: true,
    arrows: false,
    autoplay: banners.data.length > 1, // only autoplay if more than 1 banner
    autoplaySpeed: 3000,
  };

  return (
    <div className="home_hero">
      {/* Placeholder while loading */}
      {banners.status === false ? (
        <div className="main-content-box py-4">
          <div className="container placeholder-glow">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-5 my-4">
                <div className="content-box">
                  <h1>
                    <span className="placeholder col-4"></span>
                  </h1>
                  <p className="my-4">
                    <span className="placeholder col-12"></span>
                    <br />
                    <span className="placeholder col-8"></span>
                    <br />
                    <span className="placeholder col-4"></span>
                    <br />
                  </p>
                  <div className="button-light mt-5">
                    <a className="disabled placeholder">
                      <span className="px-4 py-2"></span>
                    </a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5 my-4">
                <div className="image-box placeholder w-100 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Slider */}
      {banners.data.length > 0 && (
        <Slider {...settings}>
          {banners.data.map((item) => (
            <div key={item.id}>
              <div className="main-content-box ">
                <div className="container">
                  <div className="row justify-content-between align-items-center">
                    <div className="col-lg-5  my-4">
                      <div className="content-box">
                        <h1>{item.heading}</h1>
                        <p className="my-lg-4 my-md-3 my-2">{item.content}</p>
                        {item.link && (
                          <div className="button-light mt-5">
                            <a href={item.link}>
                              {item.link_text || "Shop Now"}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-lg-5  my-4">
                      <div className="image-box">
                        <img src={item.image} alt={item.heading} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      )}
    </div>
  );
}

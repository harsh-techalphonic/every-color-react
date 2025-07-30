import React, { useEffect, useState } from "react";
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
      .get(`${config.API_URL}/mobile-slider`)
      .then(function (response) {
        dispatch(bannersAction.getCategory(response.data));
      })
      .catch(function (error) {
        console.log(error);
      });
    // console.log(banners)
  }, [banners.status]);
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
    autoplaySpeed: 3000,
  };

  // const banners = [
  //   {
  //     id: 1,
  //     btnlink: "#!",
  //     btntext: "Quick Order",
  //     image: "/banner1.png",
  //     imagesAlt:"Vorem ipsum dolor inceptos himenaeos",
  //     title: "Vorem ipsum dolor inceptos himenaeos.",
  //     desc:"Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem.",
  //   },
  //   {
  //     id: 2,
  //     btnlink: "#!",
  //     btntext: "View Items",
  //     image: "/banner1.png",
  //     imagesAlt:"Vorem ipsum dolor inceptos himenaeos",
  //     title: "Vorem ipsum dolor inceptos himenaeos.",
  //     desc:"Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem.",
  //   },
  //   {
  //     id: 3,
  //     btnlink: "#!",
  //     btntext: "Go for More",
  //     image: "/banner1.png",
  //     imagesAlt:"Vorem ipsum dolor inceptos himenaeos",
  //     title: "Vorem ipsum dolor inceptos himenaeos.",
  //     desc:"Norem ipsum dolor sit amet, consectetur adipiscing elit. Etiam eu turpis molestie, dictum est a, mattis tellus. Sed dignissim, metus nec fringilla accumsan, risus sem.",
  //   }
  // ];
  return (
    <div className="home_hero">
      {banners.status == false ? (
        <div className="main-content-box py-4">
          <div className="container placeholder-glow">
            <div className="row justify-content-between align-items-center">
              <div className="col-lg-5">  
                <div className="content-box">
                  <h1><span className="placeholder col-4"></span></h1>
                  <p className="my-4">
                  <span className="placeholder col-12"></span><br/>
                  <span className="placeholder col-8"></span><br/>
                  <span className="placeholder col-4"></span><br/>
                  </p>
                  <div className="button-light mt-5">
                    <a className="disabled placeholder"><span className=" px-4 py-2"></span></a>
                  </div>
                </div>
              </div>
              <div className="col-lg-5">
                <div className="image-box placeholder w-100 rounded">
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <Slider {...settings}>
        {banners.data.map((item) => (
          <div key={item.id}>
            <div className="main-content-box py-4">
              <div className="container">
                <div className="row justify-content-between align-items-center">
                  <div className="col-lg-5">
                    <div className="content-box">
                      <h1>{item.title}</h1>
                      <p className="my-4">{item.description} </p>
                      <div className="button-light mt-5">
                        <a href={item.url}>{item.button_text}</a>
                      </div>
                    </div>
                  </div>
                  <div className="col-lg-5">
                    <div className="image-box">
                      <img src={item.url} alt={item.title} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

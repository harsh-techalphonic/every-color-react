import React, { useEffect } from "react";
import "./Home.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import Hero from "../../Components/Home/Hero/Hero";
import Categories from "../../Components/Home/Categories/Categories";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import HotOffer from "../../Components/Home/HotOffer/HotOffer";
import SuperSaving from "../../Components/Home/SuperSaving/SuperSaving";
import MultiBanners from "../../Components/Home/MultiBanners/MultiBanners";
import DealsOfDay from "../../Components/Home/DealsOfDay/DealsOfDay";
import CategoryBestSellers from "../../Components/Home/CategoryBestSellers/CategoryBestSellers";
import AOS from "aos";
import "aos/dist/aos.css";
import Gprscertified from "../../Components/Home/Gprscertified/Gprscertified";
import Brands from "../../Components/Home/Brands/Brands";
import ScrollToTop from "../ScrollToTop";
import Category from "../Category/Category";
import Press from "../../Components/Home/Press/Press";
import TestimonialSlider from "../../Components/Home/Testimonial/Testimonial";
import ExploreBestSeller from "../../Components/Home/ExploreBestSeller/ExploreBestSeller";

export default function Home() {
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <>
    <ScrollToTop/>
      <Header />
      <Hero />
      <Gprscertified />
      {/* <Brands /> */}
      <Categories />
      <BestSelling />
      <HotOffer />
      <SuperSaving />
      <MultiBanners />
      <ExploreBestSeller/>
      <DealsOfDay />
      <CategoryBestSellers />
      {/* <Category/> */}
      <Press/>
      <TestimonialSlider/>

      <Footer />
    </>
  );
}

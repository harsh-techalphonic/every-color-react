/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect } from "react";
import "./Home.css";
import Header from "../../Components/Partials/Header/Header";
import Footer from "../../Components/Partials/Footer/Footer";
import Hero from "../../Components/Home/Hero/Hero";
import Categories from "../../Components/Home/Categories/Categories";
import BestSelling from "../../Components/Home/BestSelling/BestSelling";
import SuperSaving from "../../Components/Home/SuperSaving/SuperSaving";
import MultiBanners from "../../Components/Home/MultiBanners/MultiBanners";
import DealsOfDay from "../../Components/Home/DealsOfDay/DealsOfDay";
import CategoryBestSellers from "../../Components/Home/CategoryBestSellers/CategoryBestSellers";
import AOS from "aos";
import "aos/dist/aos.css";
import Gprscertified from "../../Components/Home/Gprscertified/Gprscertified";
import ScrollToTop from "../ScrollToTop";
import Press from "../../Components/Home/Press/Press";
import TestimonialSlider from "../../Components/Home/Testimonial/Testimonial";
import ExploreBestSeller from "../../Components/Home/ExploreBestSeller/ExploreBestSeller";
import { useDispatch } from "react-redux";
import { cartAction } from "../../store/Products/cartSlice";
import { API_URL, GetCartList } from "../../Config/config.js";
import HotOfferHome from "../../Components/Home/HotOffer/HotOfferHome.jsx";
import { wishlistAction } from "../../store/Products/wishlistSlice.js";
import { fetchUserDataApi, fetchWishListApi } from "../../API/AllApiCode.js";
import { userAction } from "../../store/User/userSlice.js";

export default function Home() {
  const dispatch = useDispatch();
  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await fetch(`${API_URL}${GetCartList}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        const result = await res.json();

        if (result.status && result.data.length > 0) {
          const cartData = result.data.map((cartItem) => {
            const product = cartItem.product;

            dispatch(cartAction.addCart(product));
          });
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };

    const getWishlist = async () => {
      try {
        const wishlistResponse = await fetchWishListApi();

        if (wishlistResponse?.status && wishlistResponse?.data?.length > 0) {
          dispatch(wishlistAction.setWishlist(wishlistResponse.data));
        } else {
          dispatch(wishlistAction.setWishlist([]));
        }
      } catch (err) {
        console.error("Error loading wishlist:", err);
      }
    };
    const getUserProfile = async () => {
      try {
        const userResponse = await fetchUserDataApi();
        console?.log("userResponse -------->>>>", userResponse);

        if (userResponse && userResponse) {
          dispatch(userAction.setUserProfile(userResponse));
        } else {
          dispatch(userAction.clearUserProfile());
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
        dispatch(userAction.clearUserProfile());
      }
    };

    fetchCart();
    getWishlist();
    getUserProfile();
  }, []);

  return (
    <>
      <ScrollToTop />
      <Header />
      <Hero />
      <Gprscertified />
      {/* <Brands /> */}
      <Categories />
      <BestSelling />
      <HotOfferHome />
      <SuperSaving />
      <MultiBanners />
      <ExploreBestSeller />
      <DealsOfDay />
      <CategoryBestSellers />
      {/* <Category/> */}
      <Press />
      <TestimonialSlider />
      <Footer />
    </>
  );
}

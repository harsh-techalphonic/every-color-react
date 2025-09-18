import React, { useEffect, useState } from "react";
import "./DashBoard.css";
import { Link } from "react-router-dom";
import { fetchUserDataApi } from "../../../API/AllApiCode";
import { ImageUrl } from "../../../Config/config";


export default function DashBoard({ setActiveTab }) {
  const [userProfileDta, setUserProfileDta] = useState([]);
  const [orderStats, setOrderStats] = useState([]);

  useEffect(() => {
    const getUserProfile = async () => {
      try {
        const userResponse = await fetchUserDataApi();

        if (userResponse) {
          setUserProfileDta(userResponse.user);

          setOrderStats([
            {
              imgSrc: "/total-Order.png",
              title: "Total Orders",
              count: userResponse.total_orders,
            },
            {
              imgSrc: "/pending_box.png",
              title: "Pending Orders",
              count: userResponse.pending_orders,
            },
            {
              imgSrc: "/cart_box.png",
              title: "Delivered Orders",
              count: userResponse.deliveredOrders,
            },
            {
              imgSrc: "/cart_box.png",
              title: "My Cart",
              count: userResponse.cartcount,
            },
          ]);
        }
      } catch (err) {
        console.error("Error loading user profile:", err);
      }
    };
    getUserProfile();
  }, []);

  return (
    <>
      <div className="dashbaord_kbox">
        <div className="row">
          <div className="col-lg-7">
            <div className="dashborad_profile d-flex align-items-center ">
              <div className="profile-box">
                <img
                  src={userProfileDta?.profile_image || "/avatar-profile.png"}
                  alt=""
                />
              </div>
              <div className="profile-content">
                <h3>{userProfileDta?.name}</h3>
                <p className="rmail mb-0">
                  <Link to="#!">{userProfileDta?.email}</Link>
                </p>
                <p className="pphone mb-0">
                  <Link to="#!">{userProfileDta?.phone}</Link>
                </p>
              </div>
              <Link
                onClick={(e) => {
                  e.preventDefault();
                  setActiveTab("Account_details");
                }}
                className="edit_profile"
              >
                {" "}
                Edit Profile{" "}
              </Link>
            </div>

            <div className="ordera-boxer mt-5 ">
              {orderStats.map((item, index) => (
                <div className="orderbox-one mb-3" key={index}>
                  <div className="order-iocn">
                    <img src={item.imgSrc} alt={item.title} />
                  </div>
                  <div className="order-content">
                    <h4>{item.title}</h4>
                    <p>{item.count}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

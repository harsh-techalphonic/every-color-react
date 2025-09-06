import React, { useEffect, useState } from "react";
import "./DashBoard.css";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const orderData = [
  {
    imgSrc: "/total-Order.png",
    title: "Total Orders",
    count: 154,
  },
  {
    imgSrc: "/pending_box.png",
    title: "Pending Orders",
    count: 5,
  },
  {
    imgSrc: "/cart_box.png",
    title: "Completed Orders",
    count: 149,
  },
  {
    imgSrc: "/cart_box.png",
    title: "My Cart",
    count: 9,
  },
];

export default function DashBoard() {
  const user = useSelector((state) => state?.user?.profile);
  console?.log("user--------------->>>>>>>", user);
  const [userProfileDta, setUserProfileDta] = useState([]);

  useEffect(() => {
    if (user) {
      setUserProfileDta(user);
    }
  }, []);

  
  console?.log("userProfileDta--------------->>>>>>>", userProfileDta);
  return (
    <>
      <div className="dashbaord_kbox">
        <div className="row">
          <div className="col-lg-7">
            <div className="dashborad_profile d-flex align-items-center ">
              <div className="profile-box">
                <img src={userProfileDta?.profile || "/avatar-profile.png"} alt="" />
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
              <Link to="AccountDetails" className="edit_profile">
                {" "}
                Edit Profile{" "}
              </Link>
            </div>

            <div className="ordera-boxer mt-5 ">
              {orderData.map((item, index) => (
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

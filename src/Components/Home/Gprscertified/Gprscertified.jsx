import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import BasicInfoApi from "../../../API/BasicInfoApi";
import { useSelector } from "react-redux";

export default function Gprscertified() {
  const basicInfo = useSelector((store) => store.basicInfo);

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const basicInfoArray =
    basicInfo && basicInfo.data && typeof basicInfo.data === "object"
      ? Object.values(basicInfo.data)
      : [];

  return (
    <>
      <section className="gprscertified">
        <BasicInfoApi />
        <div className="container">
          <div className="row">
            {basicInfoArray.map((item) => (
              <div className="col-lg-3 col-md-6 mb-lg-0 my-lg-3 my-md-3 mb-2" key={item.id}>
                <div className="gprscertified-box d-flex align-items-center  gap-3">
                  <div className="gprscertified-icon">
                    <img src={item.image} alt={item.heading} />
                  </div>
                  <div className="gprscertified-content">
                    <h4 className="mb-0">{item.heading}</h4>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

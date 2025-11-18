import React, { useEffect, useState } from 'react';
import "./Support.css";
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import logo from '../../assets/EveryColourLogo.png'
import HelmetComponent from '../../Components/HelmetComponent/HelmetComponent';
import { API_URL } from '../../Config/config';

export default function Support({ onHeaderHeight }) {
  const [supportData, setSupportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/web/support-page`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setSupportData(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching support data:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <h4>Loading Support Page...</h4>
      </div>
    );
  }

  if (!supportData) {
    return (
      <div className="text-center py-5">
        <h4>Failed to load support content.</h4>
      </div>
    );
  }

  const banner = supportData.banner?.[0];
  const contacts = supportData.contact || [];
    // console.log("banner", banner)
  return (
    <>
      <Header onHeight={onHeaderHeight} />
      <HelmetComponent
                    title={banner?.meta_title}
                    description={banner?.meta_description}
                    keywords={banner?.meta_keyword}
                    image={logo}
                  /> 

      {/* Banner Section */}
      <div className="support_banner py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="contnet-left">
                <h2>{banner?.heading}</h2>
                <p>{banner?.content}</p>
              </div>
            </div>
            <div className="col-lg-6">
              <div className="image-right">
                <img
                  src={banner?.image}
                  alt="Support Banner"
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="support_content">
        <div className="container">
          <div className="support_title">
            <span>CONTACT US</span>
            <h2>Don’t find your answer? Contact with us</h2>
          </div>

          <div className="row justify-content-center mt-4">
            {contacts.map((item, index) => (
              <div className="col-lg-5 mb-4" key={index}>
                <div className="support_box d-flex gap-4">
                  <div className={`support_box_img a${index + 1}`}>
                    <img
                      src={
                        index === 0
                          ? "/PhoneCall.png"
                          : index === 1
                          ? "/ChatCircleDots.png"
                          : "/Mail.png"
                      }
                      alt=""
                    />
                  </div>

                  <div className="support_box_content">
                    <h2 className='text-uppercase'>{item.heading}</h2>
                    <p>{item.content}</p>

                    {/* For Phone */}
                    {index === 0 ? (
                        // Call buttons
                        <>
                          <a href={`tel:${item.sub_heading}`} className="call-redi">
                            {item.sub_heading}
                          </a>
                          <a href={`tel:${item.sub_heading}`} className="call_btn_tbn">
                            Call now <FontAwesomeIcon icon={faArrowRight} />
                          </a>
                        </>
                      ) : index === 1 ? (
                        // WhatsApp buttons
                        <>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${item.sub_heading}`}
                            className="call-redi"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Whatsapp Support
                          </a>
                          <a
                            href={`https://api.whatsapp.com/send?phone=${item.sub_heading}`}
                            className="call_btn_ttbn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Whatsapp <FontAwesomeIcon icon={faArrowRight} />
                          </a>
                        </>
                      ) : (
                        // Mail buttons (fallback)
                        <>
                          <a
                            href={`mailto:${item.sub_heading}`}
                            className="call-redi"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Mail Support
                          </a>
                          <a
                            href={`mailto:${item.sub_heading}`}
                            className="call_btn_tttbn"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Mail <FontAwesomeIcon icon={faArrowRight} />
                          </a>
                        </>
                      )}

                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

import React, { useEffect, useState } from 'react';
import './HotOffer.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';

export default function HotOfferHome() {
  const [sectionData, setSectionData] = useState(null);

  useEffect(() => {
    fetch('https://dimgrey-eel-688395.hostingersite.com/api/web/section/about-bag')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSectionData(data[0]);
        }
      })
      .catch((err) => console.error('Error fetching Hot Offer data:', err));
  }, []);

  return (
    <section className="Hot_offers py-5">
      <div className="container">
        <div className="row justify-content-between align-items-center">
          <div className="col-lg-5 mb-lg-0 mb-4">
            <div className="Hot_offer-Content">
              {sectionData?.sub_heading && <span>{sectionData.sub_heading}</span>}
              {sectionData?.heading && <h2>{sectionData.heading}</h2>}
              {sectionData?.content && <p>{sectionData.content}</p>}
              {sectionData?.link && (
                <div className="button-dark mt-4">
                  <Link to={sectionData.link} target="_blank" rel="noopener noreferrer">
                    {sectionData?.link_text || 'Shop Now'}{' '}
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </Link>
                </div>
              )}
            </div>
          </div>
          <div className="col-lg-5  mb-lg-0 mb-4">
            <div className="Hot_offer-image">
              {sectionData?.image ? (
                <img src={sectionData.image} alt={sectionData.heading || 'Hot offer'} />
              ) : (
                <div className="placeholder-image">No banner available</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

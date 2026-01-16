import React, { useState } from 'react';
import { ImageUrl } from '../../Config/config';

export default function ProductDescription({singleProduct}) {
 
  const [activeTab, setActiveTab] = useState('Description');

  const handleTabClick = (tab) => setActiveTab(tab);

  const tabContent = () => {
    switch (activeTab) {
      case 'Description':
        return (
          <div className="asdknc-desc mt-4">
            <div className="row">
              <div className="col-lg-6">
                <div className="conte">
                  <div dangerouslySetInnerHTML={{ __html: singleProduct.product_description}} />
                </div>
              </div>
              <div className="col-lg-3">
                <div className="conte">
                  <h5>Feature</h5>
                  <ul className="list-unstyled">
                    {singleProduct?.key_features?.map((item, index)=>(
                      <li className="d-flex align-items-center gap-3 mb-3" key={index}><img src={`${ImageUrl}/${item.image}`} alt="Medal" /> {item.text}</li>

                    ))}
                    
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="conte">
                  <h5>Shipping Information</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center gap-3 mb-3">Fast & reliable nationwide delivery</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Secure and protective product packaging</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Real-time shipment tracking</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Easy return & exchange policy</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Delivery time depends on your location</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Customer support available 24/7</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        );
      case 'Additional information':
        return (
          <div className="asdknc-desc mt-4">
            <div className="row">
              <div className="col-lg-6">
                <div className="conte">
                  {/* <h5>Description</h5> */}
                  <div dangerouslySetInnerHTML={{ __html: singleProduct.product_about
}} />
                </div>
              </div>
              {/* <div className="col-lg-3">
                <div className="conte">
                  <h5>Feature</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Medal.png" alt="Medal" /> Free 1 Year Warranty</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Truck.png" alt="Truck" /> Free Shipping & Fast Delivery</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Handshake.png" alt="Handshake" /> 100% Money-back Guarantee</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Headphones.png" alt="Headphones" /> 24/7 Customer Support</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/CreditCard.png" alt="Credit Card" /> Secure Payment Method</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="conte">
                  <h5>Shipping Information</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center gap-3 mb-3">Helps maintain blood sugar levels</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Meets protein and fibre requirements in patients with diabetes</li>
                    <li className="d-flex align-items-center gap-3 mb-3">High in fibre and protein</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Low glycemic index and fat</li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        );
      case 'Specification':
        return (
          <div className="asdknc-desc mt-4">
            <div className="row">
              <div className="col-lg-6">
                <div className="conte">
                <div dangerouslySetInnerHTML={{ __html: singleProduct.specification}} />
                </div>
              </div>
              {/* <div className="col-lg-3">
                <div className="conte">
                  <h5>Feature</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Medal.png" alt="Medal" /> Free 1 Year Warranty</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Truck.png" alt="Truck" /> Free Shipping & Fast Delivery</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Handshake.png" alt="Handshake" /> 100% Money-back Guarantee</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/Headphones.png" alt="Headphones" /> 24/7 Customer Support</li>
                    <li className="d-flex align-items-center gap-3 mb-3"><img src="/CreditCard.png" alt="Credit Card" /> Secure Payment Method</li>
                  </ul>
                </div>
              </div>
              <div className="col-lg-3">
                <div className="conte">
                  <h5>Shipping Information</h5>
                  <ul className="list-unstyled">
                    <li className="d-flex align-items-center gap-3 mb-3">Helps maintain blood sugar levels</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Meets protein and fibre requirements in patients with diabetes</li>
                    <li className="d-flex align-items-center gap-3 mb-3">High in fibre and protein</li>
                    <li className="d-flex align-items-center gap-3 mb-3">Low glycemic index and fat</li>
                  </ul>
                </div>
              </div> */}
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="product-description my-5">
      <div className="container mb-5">
        <ul className="nav nav-tabs" role="tablist">
          {['Description', 'Additional information', 'Specification'].map((tab) => (
            <li className="nav-item" key={tab} role="presentation">
              <button
                className={`nav-link ${activeTab === tab ? 'active' : ''}`}
                onClick={() => handleTabClick(tab)}
                type="button"
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            </li>
          ))}
        </ul>
        <div className="tab-content mt-4">{tabContent()}</div>
      </div>
      {/* <div className="container mt-4">
        <div className="descipt-box">
          <h4>Product Description</h4>
          <div dangerouslySetInnerHTML={{ __html: singleProduct.product_description}} />
        </div>
      </div> */}
    </div>
  );
}

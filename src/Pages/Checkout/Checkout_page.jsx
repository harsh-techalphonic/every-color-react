import React from 'react'
import Header from '../../Components/Partials/Header/Header'
import Footer from '../../Components/Partials/Footer/Footer'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faHouse } from '@fortawesome/free-solid-svg-icons'
import Checkout from '../../Components/Checkout/Checkout'
import ScrollToTop from '../ScrollToTop'

export default function Checkout_page() {
  
  return (
    <>
    <ScrollToTop/>
        <Header/>

      <div className="breadcrum_box mt-2">
        <nav aria-label="breadcrumb">
          <div className="container">
            <ol className="breadcrumb mb-0">
              <li className="breadcrumb-item">
                <Link to="/home" className="d-flex align-items-center gap-2">
                  <FontAwesomeIcon
                    icon={faHouse}
                    style={{ fontSize: "14px", marginTop: "-4px" }}
                  />{" "}
                  Home
                </Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Chechout
              </li>
            </ol>
          </div>
        </nav>
      </div>

      <Checkout />

      <Footer />
    </>
  );
}

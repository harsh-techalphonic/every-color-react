import React from 'react'
import Header from '../../Components/Partials/Header/Header'
import Footer from '../../Components/Partials/Footer/Footer'
import { useSelector } from 'react-redux';
import TcpprcApi from '../../API/TcpprcApi'
import ScrollToTop from '../ScrollToTop';


export default function Privacy_policy_vendor() {
  const tcpprc = useSelector((store) => store.Tcpprc); 
  return (
    <>
    <ScrollToTop/>
      <Header/>
      <TcpprcApi/>
        <div className='term-Conditons_sec my-5'> 
          <div className='container'>
            <div className='term_tiles'>
              
              {!tcpprc.status ? (
                <div>
                  <div className="placeholder-glow">
                    <span className="placeholder col-6"></span>
                    <span className="placeholder col-4"></span>
                    <span className="placeholder col-8"></span>
                    <span className="placeholder col-5"></span>
                  </div>
                </div>
              ) : (
                <>
                  <h1>{ tcpprc.data.privacy_policy_vendor.title || 'Privacy Policy'}</h1>
                  <div dangerouslySetInnerHTML={{ __html: tcpprc.data.privacy_policy_vendor.content }} />
                </>
            )}
            </div>
          </div>
        </div>
      <Footer/>
    </>
  )
}

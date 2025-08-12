import React, { useEffect, useState } from 'react';
import Header from '../../Components/Partials/Header/Header';
import Footer from '../../Components/Partials/Footer/Footer';
import { useSelector } from 'react-redux';
import TcpprcApi from '../../API/TcpprcApi';
import ScrollToTop from '../ScrollToTop';
import {getReturnCancelation} from "../../API/AllApiCode";
import {ReturnCancelation } from "../../Config/config";

export default function Return_policy() {
  // const tcpprc = useSelector((store) => store.Tcpprc); 
  const tcpprc = useSelector((store) => store.Tcpprc);

  const [policy, setPolicy] = useState([]);
  // console?.log("policy", policy?.content);

  useEffect(() => {
    getReturnCancelation(setPolicy, ReturnCancelation);
  }, []);

  return (
    <>
    <ScrollToTop/>
          <Header />
          <TcpprcApi/>
          <div className='term-Conditons_sec my-5'>
            <div className='container'>
              <div className="term_tiles">
            {!policy ? (
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
                <h1 className="py-3">
                  {tcpprc.data.terms_condition.title || "Return and Cancelation"}
                </h1>
                <div
                  dangerouslySetInnerHTML={{
                    // __html: tcpprc.data.privacy_policy.content,
                    __html: policy?.content,
                  }}
                />
              </>
            )}
          </div>
            </div>
          </div>
          <Footer />
        </>
  )
}

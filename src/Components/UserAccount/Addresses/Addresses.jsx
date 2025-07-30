import React, { useState } from 'react';
import './Addresses.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-regular-svg-icons';

export default function Addresses() {
  const [showModal, setShowModal] = useState(false);

  const handleOpenAddrModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const handleCloseAddrModal = () => setShowModal(false);

  return (
    <>
      <div className='addresss_Box'>
        <div className='row'>
          <div className='col-lg-12'>
            <div className='MultipleAddress'>
              <div className='row'>
                <div className='col-lg-4 mb-3'>
                  <div className='Add_addressS'>
                    <a href='#!' onClick={handleOpenAddrModal}>
                      <div className='Icon_box'>
                        <img src='/plus_icon.png' alt='Add Address' />
                      </div>
                      <div className='Add_address_btn mt-3'>
                        <button type='button'>Add Address</button>
                      </div>
                    </a>
                  </div>
                </div>

                {[1,2,3].map((item) => (
                  <div className='col-lg-4 mb-3' key={item}>
                    <div className='AddressBox_one'>
                      <h4>Billing Address</h4>
                      <h5>Akash deep sharma</h5>

                      <p>203 C Block Sector 63, Noida Uttar Pradesh 203001</p>
                      <button>
                        <FontAwesomeIcon icon={faPenToSquare} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>  
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className='modal d-block' tabIndex='-1'>
          <div className='modal-dialog modal-dialog-centered modal-lg	'>
            <div className='modal-content'>
              <div className='modal-header'>
                <h5 className='modal-title'>Add Address</h5>
                <button type='button' className='btn-close' onClick={handleCloseAddrModal}></button>
              </div>
              <div className='modal-body'>
                <div className='row'>
                  <div className="col-lg-6 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">First Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="First Name"/>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Last Name</label>
                    <input type="text" className="form-control" id="exampleFormControlInput1" placeholder="Last Name"/>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Phone Number</label>
                    <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="+1-202-555-0118"/>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="name@example.com"/>
                  </div>
                  <div className="col-lg-12 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Address</label>
                    <input type="email" className="form-control" id="exampleFormControlInput1" placeholder="Road No. 13/x, House no. 1320/C, Flat No. 5D"/>
                  </div>
                  <div className="col-lg-6 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Country/Region</label>
                    <select className="form-select" aria-label="Default select example">
                      <option selected>Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                  <div className="col-lg-3 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">States</label>
                    <select className="form-select" aria-label="Default select example">
                      <option selected>Open this select menu</option>
                      <option value="1">One</option>
                      <option value="2">Two</option>
                      <option value="3">Three</option>
                    </select>
                  </div>
                  <div className="col-lg-3 mb-3">
                    <label for="exampleFormControlInput1" className="form-label">Zip Code</label>
                    <input type="number" className="form-control" id="exampleFormControlInput1" placeholder="120712"/>
                  </div>
                </div>
              </div>
              <div className='modal-footer'>
                <button type='button' className='btn btn-secondary' onClick={handleCloseAddrModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className='modal-backdrop fade show'></div>}
    </>
  );
}
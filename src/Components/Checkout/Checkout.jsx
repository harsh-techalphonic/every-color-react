import React, { useCallback, useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import './Checkout.css'
import { useSelector } from "react-redux";
export default function Checkout() {
  const navigate = useNavigate();
  const fetch_products = useSelector((store) => store.products);
  const [products, setProducts] = useState([]);
  const [checkCheckout, setCheckCheckout] = useState(false);
  const [checkoutDetail,setCheckoutDetail] = useState({subtotal:0,discount:0,total:0,tax:0})
  const { data } = useParams();
  let urlData = [];
  try {
    urlData = atob(data);
  } catch (e) {
    navigate("/product");
  }
  useEffect(() => {
    if (fetch_products.status && urlData) {
      const cartIds = JSON.parse(urlData);
      console.log(cartIds)
      setCheckoutDetail({...checkoutDetail, subtotal:cartIds.subTotal,discount:cartIds.discount,total:cartIds.total})
      setProducts(
        fetch_products.data
          .filter((product) =>
            cartIds.data.some((cartItem) => cartItem.prd_id === product.prd_id)
          )
          .map((product) => {
            const cartItem = cartIds.data.find(
              (cartItem) => cartItem.prd_id === product.prd_id
            );
            // console.log('cartItem',cartItem)
            let variation = cartItem.variation ? {variation:cartItem.variation} : {};
            return { ...product, quantity: (cartItem ? cartItem.quantity : 1),...variation};
          })
          
      );
      setCheckCheckout(true);
    }else{
      setCheckCheckout(false);
    }
  }, [fetch_products.status, urlData]);

  const submitCheckOut = (formData)=>{
    console.log(formData);
  }
  return (
    <div className="container checkout-container my-5">
      <form onSubmit={(e) => {
        e.preventDefault();
        submitCheckOut(e);
      }} method="POST">
        {/* <input type="hidden" name="_token" value="sgBHpivzebFjK7qMRMNrCqBurDh5NZuu71U2Fwwp" autoComplete="off" /> */}
        <div className="row justify-content-between">
          <div className="col-md-7">
            <div className="bolling-box">
              <h4>Billing Information</h4>
              <div className="row mb-3">
                <div className="col-md-12 mb-3">
                  <label htmlFor="firstName" className="form-label">User name</label>
                  <div className="d-flex gap-3">
                    <input type="text" className="form-control" id="firstName" name="first_name" placeholder="First Name" required />
                    <input type="text" className="form-control" id="lastName" name="last_name" placeholder="Last Name" required />
                  </div>
                </div>
                <div className="col-md-12 mb-3">
                  <label htmlFor="address1" className="form-label">Street Address</label>
                  <input type="text" className="form-control" name="address_1" placeholder="House number and street name ..." required />
                </div>
                <div className="mb-3">
                  <input type="text" className="form-control" name="address_2" placeholder="Apartment, suite, unit, etc (Optional)" />
                </div>
                <div className="row mb-3">
                  <div className="col-md-4">
                    <label className="form-label">Country</label>
                    <select className="form-select" name="country" defaultValue="India">
                      <option value="" disabled>Choose country</option>
                      <option value="india">India</option>
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">State</label>
                    <select className="form-select" name="state" defaultValue="">
                      <option value="" disabled>Choose State</option>
                      {[
                        "Andaman and Nicobar Islands", "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chandigarh",
                        "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jammu and Kashmir",
                        "Jharkhand", "Karnataka", "Kerala", "Ladakh", "Lakshadweep", "Madhya Pradesh", "Maharashtra",
                        "Manipur", "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Puducherry", "Punjab", "Rajasthan",
                        "Sikkim", "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal"
                      ].map(state => (
                        <option key={state} value={state}>{state}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-md-4 mb-3">
                    <label className="form-label">Zip Code</label>
                    <input type="text" className="form-control" name="zip" />
                  </div>
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="email" className="form-label">Email</label>
                  <input type="email" className="form-control" name="email" required />
                </div>
                <div className="col-md-6 mb-3">
                  <label htmlFor="phone" className="form-label">Phone Number</label>
                  <input type="tel" className="form-control" name="phone" pattern="[0-9]{10}" maxLength="10" required />
                </div>
              </div>
            </div>

            <div className="payment-box">
              <h4 className="mt-4">Payment Option</h4>
              <div className="my-3 pay-opt-box">
                <ul className="list-unstyled d-flex">
                  <li>
                    <div className="form-check d-flex flex-column">
                      <label htmlFor="cod" className="form-label">
                        <img src="/paypal.png" alt="COD Icon" />
                        <p>Cash on Delivery</p>
                      </label>
                      <input type="radio" name="payment_method" id="cod" value="cod" defaultChecked />
                    </div>
                  </li>
                  {/* <li>
                    <div className="form-check d-flex flex-column">
                      <label htmlFor="cod" className="form-label">
                        <img src="/paypal.png" alt="COD Icon" />
                        <p>Cash on Delivery</p>
                      </label>
                      <input type="radio" name="payment_method" id="cod" value="cod" defaultChecked />
                    </div>
                  </li>
                  <li>
                    <div className="form-check d-flex flex-column">
                      <label htmlFor="cod" className="form-label">
                        <img src="/paypal.png" alt="COD Icon" />
                        <p>Cash on Delivery</p>
                      </label>
                      <input type="radio" name="payment_method" id="cod" value="cod" defaultChecked />
                    </div>
                  </li> */}
                </ul>
              </div>
            </div>
          </div>

          <div className="col-md-4">
            <div className="order-summary">
              <h5>Order Summary</h5>
              <div className="summery-product">
                <ul className="list-unstyled">
                {products.map((value, index) => 
                <li key={index} className="d-flex gap-3 my-3">
                <img src={value.img_url} alt={value.title} />
                {/* <input type="hidden" name="order_image" value="q1toyNR1ieo6jN7IP8Oz.jpeg" />
                <input type="hidden" name="order_quantity" value="1" />
                <input type="hidden" name="product_id" value="8" />
                <input type="hidden" name="order_amount" value="45000" /> */}
                <div>
                  <h6>{value.title}</h6>
                  <p>{value.quantity} x <span>₹{value.price}</span></p>
                </div>
              </li>
                )}
                  
                </ul>
              </div>
              <p>Subtotal: <strong>₹{checkoutDetail.subtotal}</strong></p>
              <p>Shipping: <strong>Free</strong></p>
              <p>Discount: <strong>₹{checkoutDetail.discount}</strong></p>
              <p>Tax: <strong>₹{checkoutDetail.tax}</strong></p>
              <hr />
              <p>Total: <strong>₹{checkoutDetail.total}</strong></p>
              <button type="submit" className="btn btn-success w-100">PLACE ORDER</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

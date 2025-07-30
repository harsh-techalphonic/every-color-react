import React from 'react'
import './ReturnRefund.css'
import { Link } from 'react-router-dom'

export default function ReturnRefund() {
  return (
    <div className='orders__box return_refund'>
    <div className='row'>
      <div className='col-lg-7'>
        <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
          <div className='order-box-img'>
            <img src="/PersonalCare.png" alt="" />
          </div>
          <div className='order-box_content  '>
            <p className='bold'>Delivery Champ Magma Insulated Water Insulated Water  </p>
            <p className='pricing'>₹170.99</p>
              <p className='orderID'><b>Delivered on :</b> 20 Sep 2024</p>
              <p className='orderID'><b>Status :</b> Delivered</p>
              <p className='orderID'><b>Order ID :</b> 256421ER5264TM</p>
          </div>
          <div className='Rerun_ref_btn'>
            <button className='RETURN mb-4'>RETURN </button>
            <button className='Refund'>Refund </button>
          </div>
        </div>
        <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
          <div className='order-box-img'>
            <img src="/Sim-2.png" alt="" />
          </div>
          <div className='order-box_content  '>
            <p className='bold'>Delivery Champ Magma Insulated Water Insulated Water  </p>
            <p className='pricing'>₹170.99</p>
              <p className='orderID'><b>Delivered on :</b> 20 Sep 2024</p>
              <p className='orderID'><b>Status :</b> Delivered</p>
              <p className='orderID'><b>Order ID :</b> 256421ER5264TM</p>
          </div>
          <div className='Rerun_ref_btn'>
            <button className='RETURN mb-4'>RETURN </button>
            <button className='Refund'>Refund </button>
          </div>
        </div>
        <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
          <div className='order-box-img'>
            <img src="/PersonalCare.png" alt="" />
          </div>
          <div className='order-box_content  '>
            <p className='bold'>Delivery Champ Magma Insulated Water Insulated Water  </p>
            <p className='pricing'>₹170.99</p>
              <p className='orderID'><b>Delivered on :</b> 20 Sep 2024</p>
              <p className='orderID'><b>Status :</b> Delivered</p>
              <p className='orderID'><b>Order ID :</b> 256421ER5264TM</p>
          </div>
          <div className='Rerun_ref_btn'>
            <button className='RETURN mb-4'>RETURN </button>
            <button className='Refund'>Refund </button>
          </div>
        </div>
        <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
          <div className='order-box-img'>
            <img src="/PersonalCare.png" alt="" />
          </div>
          <div className='order-box_content  '>
            <p className='bold'>Delivery Champ Magma Insulated Water Insulated Water  </p>
            <p className='pricing'>₹170.99</p>
              <p className='orderID'><b>Delivered on :</b> 20 Sep 2024</p>
              <p className='orderID'><b>Status :</b> Delivered</p>
              <p className='orderID'><b>Order ID :</b> 256421ER5264TM</p>
          </div>
          <div className='Rerun_ref_btn'>
            <button className='RETURN mb-4'>RETURN </button>
            <button className='Refund'>Refund </button>
          </div>
        </div>
        
      </div>
      <div className='col-lg-5'>
      <div className="container">
        <div className="card bg-light p-3">
            <h6>Order# (1 item)</h6>
            <Link to="#" className="text-primary">Order placed on 11th September 2024</Link>
            <p className="text-muted">Paid by Cash in Delivery</p>
        </div>

        <div className="card mt-3 p-3 ">
            <h5 className="fw-bold">Order Payment Details</h5>
            <div className="d-flex justify-content-between">
                <span>Order Amount</span>
                <span>&#8377;909.50</span>
            </div>
            <div className="d-flex justify-content-between">
                <span>Order Saving</span>
                <span>&#8377;909</span>
            </div>
            <div className="d-flex justify-content-between">
                <span>Coupon Savings</span>
                <span>&#8377;909</span>
            </div>
            <div className="d-flex justify-content-between">
                <span>Convenience Fee</span>
                <span>&#8377;909</span>
            </div>
            <hr/>
            <div className="d-flex justify-content-between fw-bold">
                <span>Order Total</span>
                <span>&#8377;90966.50</span>
            </div>
            <h6 className="mt-3 fw-bold">Payment Mode</h6>
            <p>Cash On Delivery <span className="fw-bold float-end">&#8377;90966.50</span></p>
        </div>

        <div className="card mt-3 p-3">
            <h5 className="fw-bold">Deliver to</h5>
            <p className="mb-1"><strong>Aniket Mishra</strong> <span className="badge bg-secondary">HOME</span></p>
            <p className="mb-1">203, C Block, Sector 63, Noida,</p>
            <p className="mb-1">Hazratpur Wajidpur,</p>
            <p className="mb-1">Uttar Pradesh 201301</p>
            <p><strong>Phone :</strong> 9998888999</p>
        </div>
    </div>
      </div>
    </div>
  </div>
  )
}

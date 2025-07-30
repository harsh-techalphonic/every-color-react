import React from 'react'
import './Orders.css'

export default function Orders() {
  return (
    <>
    
      <div className='orders__box'>
        <div className='row'>
          <div className='col-lg-7'>
            <div className='order-titel d-flex align-items-center justify-content-between'>
              <h2>Orders</h2>
              <select className="form-select" aria-label="Default select example">
                <option value="1">Today's</option>
                <option value="2">Last Week</option>
                <option selected>Last Month</option>
                <option value="1">Last 6 Month</option>
              </select>
            </div>

            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
            <div className='order-box-one d-flex align-items-center gap-4 mb-3'>
              <div className='order-box-img'>
                <img src="/PersonalCare.png" alt="" />
              </div>
              <div className='order-box_content'>
                  <p className='orderID'>Order ID : 256421ER5264TM</p>
                  <p className='RtuenExchange_Date'>Return / Exchange till 30 Sep 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

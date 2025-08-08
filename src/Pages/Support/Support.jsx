import React from 'react'
import "./Support.css"
import Header from '../../Components/Partials/Header/Header'
import Footer from '../../Components/Partials/Footer/Footer'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRight } from '@fortawesome/free-solid-svg-icons'

export default function Support() {
  return (
    <>
    <Header/>

    <div className='support_banner py-5' >
        <div className='container'>
            <div className='row align-items-center'>
                <div className='col-lg-6'>
                    <div className='contnet-left'>
                        <h2>How we can help you!</h2>
                        <p>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quae, deserunt!</p>
                    </div>
                </div>
                <div className='col-lg-6'>
                    <div className='image-right'>
                        <img src="/support_img.png" alt="" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div className='support_content'>
        <div className='container'>
            <div className='support_title'>
                <span>CONTACT US</span>
                <h2>Don’t find your answer. Contact with us</h2>
            </div>
            <div className='row justify-content-center mt-4'>
                <div className='col-lg-5'>
                    <div className='support_box d-flex  gap-4'>
                        <div className='support_box_img a1'>
                            <img src="/PhoneCall.png" alt="" />
                        </div>
                        <div className='support_box_content'>
                            <h2>Call us now</h2>
                            <p>we are available online from 9:00 AM to 5:00 PM (GMT95:45) Talk with use now</p>
                            <a href="" className='call-redi'>+1-202-555-0126</a>
                            <a href="tel:+1-202-555-0126" className='call_btn_tbn'>Call now <FontAwesomeIcon icon={faArrowRight}/></a>
                        </div>

                    </div>
                </div>
                <div className='col-lg-5'>
                    <div className='support_box d-flex gap-4'>
                        <div className='support_box_img a2'>
                            <img src="/ChatCircleDots.png" alt="" />
                        </div>
                        <div className='support_box_content'>
                            <h2>Chat with us</h2>
                            <p>we are available online from 9:00 AM to 5:00 PM (GMT95:45) Talk with use now</p>
                            <a href=""  className='call-redi'>Support.com</a>
                            <a href="tel:+1-202-555-0126" className='call_btn_ttbn'>Whatsapp <FontAwesomeIcon icon={faArrowRight}/></a>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    </div>


    <Footer/>

    </>
  )
}

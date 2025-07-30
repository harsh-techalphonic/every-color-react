import React, { useEffect, useState } from 'react'
import "./HotOffer.css"
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightLong } from '@fortawesome/free-solid-svg-icons'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'

export default function HotOffer() {
    let banners = useSelector((store) => store.banners);
    const [sectionData, setSectionData] = useState({});

    useEffect(()=>{
    if(banners.status == false) return;
        banners = banners.data.filter(e => e.type == "1");
        setSectionData(banners[0])
    },[banners.status]);

    return (
    <section className='Hot_offers py-5'>
        <div className='container'>
            <div className='row justify-content-between align-items-center'>
                <div className='col-lg-5'>
                    <div className='Hot_offer-Content'>
                        <span>{sectionData?.discount}</span>
                        <h2>{sectionData?.title}</h2>
                        <p>{sectionData?.description}</p>
                        <div className='button-dark mt-4'>
                                    <Link to={`/product/${sectionData?.slug}`}>{sectionData?.button_text}  <FontAwesomeIcon icon={faArrowRightLong    }/></Link>
                        </div>
                    </div>
                </div>
                <div className='col-lg-5'>
                    <div className='Hot_offer-image'>
                        <img src={sectionData?.url} alt="" />
                    </div>
                </div>
            </div>
        </div>
    </section>
  )
}

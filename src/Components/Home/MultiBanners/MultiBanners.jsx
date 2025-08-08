import React from 'react'
import './MultiBanners.css'
import { Link } from 'react-router-dom'
import MaxDicountProductAPi from '../../../API/MaxDicountProductApi'
import { useSelector } from 'react-redux';
export default function MultiBanners() {
    const maxDicountProduct = useSelector((store) => store.maxDicountProduct);
    const product_one = maxDicountProduct.data[0]
    const product_two = maxDicountProduct.data[1]
    const product_three = maxDicountProduct.data[2]
    // console.log(product_one, product_two, product_three)
  return (
    <section className='multibanner '>
        <MaxDicountProductAPi/>
        <div className='container'>
            {maxDicountProduct.status ? <div className='row'>
                <div className='col-lg-5'>
                    <div className='banners-right'>
                        <div className='banner-right-one'>
                            <Link to={`/product/${product_two.slug}`}>
                                <div className='row align-items-center'>
                                    <div className='col-lg-7  col-md-7'>
                                        <div className='banner-right-content'>
                                            <span>{Math.round(
                                                ((product_two.price - product_two.discount_price) / product_two.price) * 100
                                                )}% OFF</span>
                                            <h3>{product_two.title}</h3>
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_two.price}</p>
                                                <p className="price">₹{product_two.discount_price}</p>
                                                </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-5  col-md-5'>
                                        <div className='banner-right-img'>
                                            <img src={product_two.img_url} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='banner-right-one'>
                        <Link to={`/product/${product_three.slug}`}>
                                <div className='row align-items-center'>
                                    <div className='col-lg-7  col-md-7'>
                                        <div className='banner-right-content'>
                                            <span>{Math.round(
          ((product_three.price - product_three.discount_price) / product_three.price) * 100
        )}% OFF</span>
                                            <h3>{product_three.title}</h3>
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_three.price}</p>
                                                <p className="price">₹{product_three.discount_price}</p>
                                                </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-5  col-md-5'>
                                        <div className='banner-right-img'>
                                            <img src={product_three.img_url} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-lg-7'>
                    <Link to={`/product/${product_one.slug}`}>
                        <div className='banner-left'>
                            <div className='row align-items-center'>
                                <div className='col-lg-7 col-md-7'>
                                        <div className='banner-left-content'>
                                            <span>{Math.round(
                                                ((product_one.price - product_one.discount_price) / product_one.price) * 100
                                                )}% OFF</span>
                                            <h2>{product_one.title}</h2>
                                            {/* <p>{product_one.title}</p> */}
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_one.price}</p>
                                                <p className="price">₹{product_one.discount_price}</p>
                                                </div>
                                        </div>
                                </div>
                                <div className='col-lg-5  col-md-5 '>
                                    <div className='banner-left-img'>
                                        <img src={product_one.img_url} alt="" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Link>
                </div>
                
            </div> : ""}
            
        </div>
    </section>
  )
}

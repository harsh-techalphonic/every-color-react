import React from 'react'
import './MultiBanners.css'
import { Link } from 'react-router-dom'
import MaxDicountProductAPi from '../../../API/MaxDicountProductApi'
import { useSelector } from 'react-redux';
export default function MultiBanners() {
    const maxDicountProduct = useSelector((store) => store.maxDicountProduct);
    console.log("Multi banner", maxDicountProduct )
    const products = maxDicountProduct?.data?.data || []; 

const product_one   = products[0];
const product_two   = products[1];
const product_three = products[2];

console.log("product one ", product_one);
console.log("product two ", product_two);
console.log("product three ", product_three);
  return (
    <section className='multibanner '>
        <MaxDicountProductAPi/>
        <div className='container'>
            {maxDicountProduct.status ? <div className='row'>
                <div className='col-lg-5'>
                    <div className='banners-right'>
                        <div className='banner-right-one'>
                            <Link to={`/product/${product_two.product.product_slug}`}>
                                <div className='row align-items-center'>
                                    <div className='col-lg-7  col-md-7'>
                                        <div className='banner-right-content'>
                                            <span>{Math.round(product_two.product.percent_off
                                                )}% OFF</span>
                                            <h3>{product_two.product.product_name}</h3>
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_two.product.product_price}</p>
                                                <p className="price">₹{product_two.product.product_discount_price}</p>
                                                </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-5  col-md-5'>
                                        <div className='banner-right-img'>
                                            <img src={product_two.product.product_image} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                        <div className='banner-right-one'>
                        <Link to={`/product/${product_three.product.product_slug}`}>
                                <div className='row align-items-center'>
                                    <div className='col-lg-7  col-md-7'>
                                        <div className='banner-right-content'>
                                            <span>{Math.round(product_three.product.percent_off
                                                )}% OFF</span>
                                            <h3>{product_three.product.product_name}</h3>
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_three.product.product_price}</p>
                                                <p className="price">₹{product_three.product.product_discount_price}</p>
                                                </div>
                                        </div>
                                    </div>
                                    <div className='col-lg-5  col-md-5'>
                                        <div className='banner-right-img'>
                                            <img src={product_three.product.product_image} alt="" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='col-lg-7'>
                    <Link to={`/product/${product_one.product.product_slug}`}>
                        <div className='banner-left'>
                            <div className='row align-items-center'>
                                <div className='col-lg-7 col-md-7'>
                                        <div className='banner-left-content'>
                                            <span>{Math.round(product_one.product.percent_off
                                                )}% OFF</span>
                                            <h2>{product_one.product.product_name}</h2>
                                            {/* <p>{product_one.product.product_about}</p> */}
                                            <div dangerouslySetInnerHTML={{ __html: product_one.product.expect}} />
                                            <div className="Pricing ">
                                                <p className="slashPrice">₹{product_one.product.product_price}</p>
                                                <p className="price">₹{product_one.product.product_discount_price}</p>
                                                </div>
                                        </div>
                                </div>
                                <div className='col-lg-5  col-md-5 '>
                                    <div className='banner-left-img'>
                                        <img src={product_one.product.product_image} alt="" />
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

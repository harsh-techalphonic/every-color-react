import React from 'react'
import Header from '../../Components/Partials/Header/Header'
import Footer from '../../Components/Partials/Footer/Footer'
import './About.css'
import { useSelector } from 'react-redux';
import AboutApi from '../../API/AboutApi';
import ScrollToTop from '../ScrollToTop';

export default function About() {
    const About = useSelector((store) => store.About); 
  return (
    <>
        <ScrollToTop/>
        <Header/>
        <AboutApi/>
            <section className='about_banner'>
                <div className='container d-flex align-items-center justify-content-center'>
                    <div className='about_Title'>
                        <h1>{About.data.title}</h1>
                    </div>
                </div>
            </section>

            <section className='about_description my-5'>
                <div className='container'>
                    <div className='row align-items-center'>
                        <div className='col-lg-6'>
                            <div className='text_left'>
                                
                                {/* <h2>Our Story</h2> */}

                                <div dangerouslySetInnerHTML={{ __html: About.data.content }} />
                            </div>
                        </div>
                        <div className='col-lg-6'>
                            <div className='image_right'>
                                <img src="/about_img.png" alt="" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='Our_mission_vission'>
                <div className='container'>
                    <div className='row g-5'>
                        <div className='col-lg-4 mb-3'>
                            <div className='mis_box mission'>
                                <div className="title-banner">{About.data.mission_title}</div>
                                <div className="info-card ">
                                    <div className='info-img'>
                                        <img src="/Objects.png" alt="Target Icon"/>
                                    </div>
                                    <p>{About.data.mission_content} </p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 mb-3'>
                            <div className='mis_box vision'>
                                <div className="title-banner">{About.data.vision_title}</div>
                                <div className="info-card ">
                                    <div className='info-img'>
                                        <img src="/Isolation_Mode.png" alt="Target Icon"/>
                                    </div>
                                    <p>{About.data.vision_content}</p>
                                </div>
                            </div>
                        </div>
                        <div className='col-lg-4 mb-3'>
                            <div className='mis_box values'>
                                <div className="title-banner">{About.data.value_title}</div>
                                <div className="info-card ">
                                    <div className='info-img'>
                                        <img src="/Isolation_Mode (1).png" alt="Target Icon"/>
                                    </div>
                                    <p>{About.data.value_content}</p>
                                    {/* <p>Pellentesque ultrices, dui vel hendrerit iaculis, ipsum velit vestibulum risus, ac tincidunt diam lectus id magna. Praesent maximus lobortis neque sit amet rhoncus. </p> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className='newsleter_subscription mt-5'>
                <div className='container'>
                    <div className='row justify-content-center'>
                        <div className='col-lg-6'>
                            <div className='newsleter_content text-center'>
                                <h3>Subscribe to our newsletter</h3>
                                <p>Praesent fringilla erat a lacinia egestas. Donec vehicula tempor libero et cursus. Donec non quam urna. Quisque vitae porta ipsum.</p>
                                <form action="">
                                    <input type="email" maxLength="50" required placeholder="Email address"/>
                                    <button className="bt">Subscribe</button>

                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            

        <Footer/>
    </>
  )
}

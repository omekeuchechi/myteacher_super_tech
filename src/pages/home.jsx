import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HeroSection from "../components/hero";
import Nav from "../components/nav";
import HeroVideo from "../components/heroVideo";
import Main from "../components/main";
import "../assets/styles/styles.css";
import DigitalSkills from "../components/digitalSkills";
import PopularCourses from "../components/popularCourses";
import Services from "../components/services";
import TechRoadMap from "../components/techRoadMap";
import AiSection from "../components/aiSection";
import Gallary from "../components/gallary";
import Testimony from "../components/testimony";
import Footer from "../components/footer";
import Faq from "../components/faq";
import FunTech from "../components/funTech";
import WhatAppInfo from "../components/whatappInfo";
import AboutCom from "../components/aboutComponent/aboutBody";
import ContactUs from "../components/contactUs";
import Testimonial from "../components/testimonial";

function Home() {

useEffect(() => {
    const fadeInElements = document.querySelectorAll(".fade-in");

    const observer = new IntersectionObserver(
        (entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("scroll-visible");
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        },
        { threshold: 0.1 } // Trigger when 10% of the element is visible
    );

    fadeInElements.forEach(element => observer.observe(element));

    // Cleanup observer on component unmount
    return () => {
        observer.disconnect();
    };
}, []);

    return(
        <>
            <HeroVideo />
            <Nav />
            <HeroSection />
            <Main /> 
            {/* <DigitalSkills /> */}
            <PopularCourses />
            {/* <AboutCom /> */}
            <Services />
            <Faq /> 
            <TechRoadMap />
            <FunTech />
            <AiSection />
            <Gallary />
            <Testimony />
            <WhatAppInfo />
            <Testimonial />
            <ContactUs />
            <Footer />
        </>
    )
}

export default Home;
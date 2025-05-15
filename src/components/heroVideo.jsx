import { useState } from 'react';
import HVideo from '../assets/video/7989674-hd_1920_1080_25fps.mp4';

const HeroVideo = () => {
    return (
        <div className="hero-video fade-in">
            <video width="" autoPlay loop muted src={HVideo}>
            </video>
        </div>
    );
};

export default HeroVideo;
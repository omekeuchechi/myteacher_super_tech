import React from 'react';
import '../assets/styles/flyers.css';

// Flyer images
import myteacherIntituteAnnouncement1 from '../assets/images/myteacher intitute announcement1.jpg';
import myteacherIntituteAnnouncement2 from '../assets/images/myteacher intitute announcement2.jpg';
import myteacherIntituteAnnouncement3 from '../assets/images/myteacher intitute announcement3.jpg';

const FlyerImages = [
    { image: myteacherIntituteAnnouncement1, alt: 'myteacher institute announcement1' },
    { image: myteacherIntituteAnnouncement2, alt: 'myteacher institute announcement2' },
    { image: myteacherIntituteAnnouncement3, alt: 'myteacher institute announcement3' },
];

const Flyers = () => {
    return (
        <section className="flyers-section">
            <h2 className="flyers-header">Myteacher Tech Hub</h2>
            <div className="flyer-images-container">
                {FlyerImages.map((item, index) => (
                    <div key={index} className="flyer-image-wrapper">
                        <img src={item.image} alt={item.alt} className="flyer-image" />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Flyers;
import { useEffect } from "react";
import img1 from '../img/download (35).jpeg';
import img2 from '../img/download (36).jpeg';
import img3 from '../img/download (39).jpeg';
import img4 from '../img/download (41).jpeg';
import img5 from '../img/download (38).jpeg';
import img6 from '../img/download (41).jpeg';
import img7 from '../img/download (35).jpeg';
import img8 from '../img/download (40).jpeg';
import img9 from '../img/download (39).jpeg';
import img10 from '../img/download (37).jpeg';
import img11 from '../img/download (40).jpeg';

const GallaryImages = [
    { image: img1, alt: 'Event Image 1' },
    { image: img2, alt: 'Event Image 2' },
    { image: img3, alt: 'Event Image 3' },
    { image: img4, alt: 'Event Image 4' },
    { image: img5, alt: 'Event Image 5' },
    { image: img6, alt: 'Event Image 6' },
    { image: img7, alt: 'Event Image 7' },
    { image: img8, alt: 'Event Image 8' },
    { image: img9, alt: 'Event Image 9' },
    { image: img10, alt: 'Event Image 10' },
    { image: img11, alt: 'Event Image 11' }
];

const Gallary = () => {
    return (
        // Gallary section
        <div className="gallary-section">
            {/* <div className="shap"></div> */}
            <div className="gallary-header">
                <h2>Our Gallary</h2>
                <p>Explore our vibrant community and the exciting events we host.</p>
            </div>
            <marquee className="gallary" scrollamount="4">
                {GallaryImages.map((item, index) => 
                    <img key={index} src={item.image} alt={item.alt} />
                )}
            </marquee>
        </div>
    );
};

export default Gallary;
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

// new gallery images
import bestTechIntituteImage1 from '../assets/images/Best tech intitute image1.jpg';
import bestTechIntituteImage2 from '../assets/images/Best tech intitute image2.jpg';
import bestTechIntituteImage3 from '../assets/images/Best tech intitute image3.jpeg';
import bestTechIntituteImage4 from '../assets/images/Best tech intitute image4.jpeg';
import bestTechIntituteImage5 from '../assets/images/Best tech intitute image5.jpeg';
import bestTechIntituteImage6 from '../assets/images/Best tech intitute image6.jpeg';
import bestTechIntituteImage7 from '../assets/images/Best tech intitute image8.jpeg';
import bestTechIntituteImage8 from '../assets/images/Best tech intitute image8.jpeg'; // Confirm if this is intentional
import bestTechIntituteImage9 from '../assets/images/Best tech intitute image9.jpeg';
import bestTechIntituteImage10 from '../assets/images/Best tech intitute image10.jpeg';
import bestTechIntituteImage11 from '../assets/images/Best tech intitute image11.jpeg';

const BestTechImages = [
    { image: bestTechIntituteImage1, alt: 'Best tech intitute image1' },
    { image: bestTechIntituteImage2, alt: 'Best tech intitute image2' },
    { image: bestTechIntituteImage3, alt: 'Best tech intitute image3' },
    { image: bestTechIntituteImage4, alt: 'Best tech intitute image4' },
    { image: bestTechIntituteImage5, alt: 'Best tech intitute image5' },
    { image: bestTechIntituteImage6, alt: 'Best tech intitute image6' },
    { image: bestTechIntituteImage7, alt: 'Best tech intitute image7' },
    { image: bestTechIntituteImage8, alt: 'Best tech intitute image8' },
    { image: bestTechIntituteImage9, alt: 'Best tech intitute image9' },
    { image: bestTechIntituteImage10, alt: 'Best tech intitute image10' },
    { image: bestTechIntituteImage11, alt: 'Best tech intitute image11' },
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
            <marquee className="gallary" scrollamount="10">
                {BestTechImages.map((item, index) => (
                    <img key={index} src={item.image} alt={item.alt} />
                ))}
            </marquee>
        </div>
    );
};

export default Gallary;
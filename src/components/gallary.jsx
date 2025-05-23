import { useEffect } from "react";
import bestTechIntituteImage1 from '../assets/images/Best tech intitute image1.jpg';
// ... (other imports for images)
import bestTechIntituteImage2 from '../assets/images/Best tech intitute image2.jpg';
import bestTechIntituteImage3 from '../assets/images/Best tech intitute image3.jpeg';
import bestTechIntituteImage4 from '../assets/images/Best tech intitute image4.jpeg';
import bestTechIntituteImage5 from '../assets/images/Best tech intitute image5.jpeg';
import bestTechIntituteImage6 from '../assets/images/Best tech intitute image6.jpeg';
import bestTechIntituteImage7 from '../assets/images/Best tech intitute image8.jpeg';
import bestTechIntituteImage8 from '../assets/images/Best tech intitute image8.jpeg';
import bestTechIntituteImage9 from '../assets/images/Best tech intitute image9.jpeg';
import bestTechIntituteImage10 from '../assets/images/Best tech intitute image10.jpeg';
import bestTechIntituteImage11 from '../assets/images/Best tech intitute image11.jpeg';

// Array of images
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
    <div className="gallary-section">
      <div className="gallary-header">
        <h2>Our Gallery</h2>
        <p>Explore our vibrant community and the exciting events we host.</p>
      </div>
      
      {/* Scrolling gallery container */}
      <div className="scrolling-wrapper">
        <div className="scrolling-content">
          {BestTechImages.map((item, index) => (
            <img key={index} src={item.image} alt={item.alt} />
          ))}
          {/* Repeat images for seamless scrolling */}
          {BestTechImages.map((item, index) => (
            <img key={'repeat-' + index} src={item.image} alt={item.alt} />
          ))}
        </div>
      </div>

      {/* Inline styles for the scrolling effect */}
      <style jsx>{`
        .gallary-section {
          padding: 40px 20px;
          background-color: #f9f9f9;
        }
        .gallary-header {
          text-align: center;
          margin-bottom: 20px;
        }
        .gallary-header h2 {
          font-size: 2em;
          margin-bottom: 10px;
        }
        .gallary-header p {
          font-size: 1.1em;
          color: #555;
        }

        .scrolling-wrapper {
          width: 100%;
          overflow: hidden;
          position: relative;
        }
        .scrolling-content {
          display: flex;
          width: calc(200%);
          animation: scroll 20s linear infinite;
        }
        .scrolling-content:hover {
          animation-play-state: paused;
        }

        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Style your images for a fantastic effect */
        .scrolling-content img {
          width: 200px; /* Adjust size as needed */
          margin: 0 15px;
          border-radius: 10px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          transition: transform 0.3s, box-shadow 0.3s;
        }
        .scrolling-content img:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 16px rgba(0,0,0,0.3);
        }

        /* Optional: make it responsive */
        @media (max-width: 768px) {
          .scrolling-content img {
            width: 150px;
          }
        }
      `}</style>
    </div>
  );
};

export default Gallary;
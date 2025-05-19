import { useEffect, useState } from "react";
import '../../assets/styles/dashboard/hero.css';

// Images
import myTeacherInstituteIllustration1 from "../../assets/illustrations/dashboard/myteacher_institute_illustration1.jpg";
import myTeacherInstituteIllustration2 from "../../assets/illustrations/dashboard/myteacher_institute_illustration2.jpg";
import myTeacherInstituteIllustration3 from "../../assets/illustrations/dashboard/myteacher_institute_illustration3.jpg";
import myTeacherInstituteIllustration4 from "../../assets/illustrations/dashboard/myteacher_institute_illustration4.jpg";

const images = [
  myTeacherInstituteIllustration1,
  myTeacherInstituteIllustration2,
  myTeacherInstituteIllustration3,
  myTeacherInstituteIllustration4,
];

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false); // start fade-out
      setTimeout(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
        setFade(true); // start fade-in
      }, 300); // fade-out duration
    }, 4000); // full cycle duration

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dash-hero-section">
      <div className="dash-txt-section">
        <h1>Welcome Joseph</h1>
        <p>Education is the passport to the future, so learn more & more.</p>
      </div>
      <div className="dash-img">
        <img
          key={currentImageIndex}
          src={images[currentImageIndex]}
          alt="My Teacher Institute"
          className={fade ? "fade-in" : ""}
        />
        <div className="dots">
          {images.map((_, idx) => (
            <div
              key={idx}
              className={`dot ${idx === currentImageIndex ? "active" : ""}`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

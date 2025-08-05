import div1 from "../../assets/svg/div1.png";
import div2 from "../../assets/svg/div2.png";
import div3 from "../../assets/svg/div3.png";
import div4 from "../../assets/svg/div4.png";

// black number png
import black1 from "../../assets/svg/divBlack1.png";
import black2 from "../../assets/svg/divBlack2.png";
import black3 from "../../assets/svg/divBlack3.png";

const Enroll = () => {
    return (
        <section className="enroll-section">
        <h2>How to Enroll — Online or Onsite</h2>
        <div className="enroll-grid">
          <div className="online">
            <h4>For Online Programmes:</h4>
            <ol>
              <li><img src={div1} alt="1" />Create an Account on the Myteacher web app</li>
              <li><img src={div2} alt="2" />Login to your Dashboard</li>
              <li><img src={div3} alt="3" />Browse Courses & Enroll</li>
              <li><img src={div4} alt="4" />Join Live Classes and start learning</li>
            </ol>
          </div>
          <div className="onsite">
            <h4>For Onsite Programmes in Port Harcourt:</h4>
            <ol>
              <li><img src={black1} alt="1" />Visit our Center at Rumuagholu or</li>
              <li><img src={black2} alt="2" />Call or Chat with Us to register your interest</li>
              <li><img src={black3} alt="3" />Pick a Schedule and start attending classes in person</li>
            </ol>
          </div>
        </div>
      </section>   
    )
}

export default Enroll;
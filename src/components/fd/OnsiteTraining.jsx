import myteacherOnsite from "../../assets/svg/myteacher_institute_onsite.png";
import vector from "../../assets/svg/Vector.png";
import vector2 from "../../assets/svg/Vector2.png";
import vector3 from "../../assets/svg/Vector3.png";
const OnsiteTraining = () => {
    return(
        <section className="onsite-section">
        <div className="onsite-container">
          <div className="onsite-text">
            <h3><img src={vector3} alt="vector" />Onsite Training in Port Harcourt</h3>
            <p>Prefer a classroom setting? Our Port Harcourt center offers hands-on learning in a vibrant, collaborative environment.</p>
            <ul>
              <li><img src={vector} alt="vector" />Expert-Led Classes</li>
              <li><img src={vector2} alt="vector2" />Practical Labs</li>
              <li><img src={vector3} alt="vector3" />Convenient Location: Tessy School Junction, Rumuagholu Port Harcourt</li>
            </ul>
            <div className="onsite-buttons">
              <button className="btn-primary">Visit Our Center</button>
              <button className="btn-outline" onClick={() => window.location.href = 'https://wa.me/2349031592480'}><i className="fa-brands fa-whatsapp"></i> WhatsApp Us</button>
            </div>
          </div>
          <div className="onsite-image">
            <img src={myteacherOnsite} alt="Campus" />
            <p className="caption">Visit Our Campus</p>
            <span>Experience hand-on learning in our state-of-the-art facilities</span>
          </div>
        </div>
      </section>
    )
}

export default OnsiteTraining;
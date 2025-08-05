import certifiedTutors from '../../assets/svg/certifiedTutors.png'
import realTimeSupport from '../../assets/svg/realTimeSupport.png'
import affordable from '../../assets/svg/affordable.png'
import jobOpportunities from '../../assets/svg/jobOpportunities.png'
const WhyChoose = () => {
    return(
        <section className="why-section">
        <h2>Why Choose Myteacher?</h2>
        <div className="why-grid">
          <div>
            <img src={certifiedTutors} alt="certified Tutors" />
            <h4>Certified Tutors</h4>
            <p>Industry-experienced instructors</p>
          </div>
          <div>
            <img src={realTimeSupport} alt="real Time Support" />
            <h4>Real-time Support</h4>
            <p>Mentorship and guidance</p>
          </div>
          <div>
            <img src={affordable} alt="affordable" />
            <h4>Affordable</h4>
            <p>Flexible payment options</p>
          </div>
          <div>
            <img src={jobOpportunities} alt="job Opportunities" />
            <h4>Job Opportunities</h4>
            <p>Access to job boards and internships</p>
          </div>
        </div>
      </section>       
    )
}

export default WhyChoose;
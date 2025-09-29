import { Link } from "react-router-dom"
import "./applyAsinstructor.css"

const ApplyAsinstructor = () => {
    return (
        <>
        <div className="applyAsinstructor-container">
            <h1>Apply as an instructor to join our platform and start teaching your skills to others.</h1>

            <div className="apply-info">
                <p>Fill in the form below to apply for an instructor position.</p>
                <span>Please if you don't have an account create one by <Link to="/auth">Registering</Link> to apply for an instructor position. so that will can get your application processed. easy and fast</span>
            </div>

            <div className="apply-as-instructor-form">
                <form action="">
                    <div className="form-group">
                        <label htmlFor="name">Name</label>
                        <input type="text" name="name" id="name" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email we can contact</label>
                        <input type="email" name="email" id="email" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Phone we can contact</label>
                        <input type="tel" name="phone" id="phone" />
                    </div>
                    <div className="form-group">
                        <label htmlFor="message">Message</label>
                        <textarea name="message" id="message" cols="30" rows="10"></textarea>
                    </div>
                    <input type="file" name="resume" id="resume" />
                    <button type="submit">Submit</button>
                </form>
            </div>
        </div>
        </>
    )
}

export default ApplyAsinstructor;
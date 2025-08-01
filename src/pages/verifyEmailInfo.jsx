import React from "react";
import { Link } from "react-router-dom";
import "../assets/styles/verify.css";
import myteacherImage from "../img/Untitled-1.png";

const VerifyEmailInfo = () => (
  <div className="authentication-container">
    <div className="overlay-bg"></div>
    <div className="verify-info">
    <img src={myteacherImage} alt="MyTeacher Logo" style={{ width: 100, marginBottom: 20 }} />
    <h2 style={{ color: "#1976d2", marginBottom: 16 }}>Verify Your Email</h2>
    <p style={{ color: "#333", fontSize: 16, marginBottom: 18 }}>
      A verification link has been sent to your email address. Please check your inbox and click the link to activate your account.
    </p>
    <p style={{ color: "#555", fontSize: 15 }}>
      Didn&apos;t get the email?&nbsp;
      <Link
        to="/resend-verification"
        style={{
          color: "#1976d2",
          textDecoration: "underline",
          fontWeight: 500
        }}
      >
        Resend Verification Link
      </Link>
    </p>
  </div>
</div>
);

export default VerifyEmailInfo;
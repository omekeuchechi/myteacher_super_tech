import React from "react";
import { Link } from "react-router-dom";

const VerifyEmailInfo = () => (
  <div
    className="verify-info"
    style={{
      maxWidth: 400,
      margin: "60px auto",
      background: "#f7f7fa",
      borderRadius: 12,
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      padding: "40px 24px",
      textAlign: "center"
    }}
  >
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
);

export default VerifyEmailInfo;
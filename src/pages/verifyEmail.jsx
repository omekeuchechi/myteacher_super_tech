import React, { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";
const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState("verifying"); // verifying, success, error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");
      return;
    }

    const verify = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/verify-email?token=${token}`);
        const data = await res.json();
        // Always show success, but use backend message for details
        setStatus("success");
        setMessage(data.message || "Your email has been verified! You can now log in.");
      } catch {
        setStatus("error");
        setMessage("Network error. Please try again.");
      }
    };

    verify();
  }, [searchParams]);

  return (
    <div
      className="verify-email-page"
      style={{
        minHeight: "60vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f7f7fa",
        borderRadius: 12,
        boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        padding: "40px 24px",
        maxWidth: 400,
        margin: "60px auto"
      }}
    >
      {status === "verifying" && (
        <p style={{ color: "#888", fontSize: 18 }}>Verifying your email...</p>
      )}
      {status === "success" && (
        <>
          <h2 style={{ color: "#2e7d32", marginBottom: 12 }}>Email Verification</h2>
          <p style={{ color: "#333", fontSize: 16, marginBottom: 24 }}>{message}</p>
          <Link
            to="/login"
            style={{
              background: "#1976d2",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 500
            }}
          >
            Go to Login
          </Link>
        </>
      )}
      {status === "error" && (
        <>
          <h2 style={{ color: "#d32f2f", marginBottom: 12 }}>Verification Failed</h2>
          <p style={{ color: "#333", fontSize: 16, marginBottom: 24 }}>{message}</p>
          <Link
            to="/resend-verification"
            style={{
              background: "#ffa000",
              color: "#fff",
              padding: "10px 24px",
              borderRadius: 6,
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 16
            }}
          >
            Resend Verification Email
          </Link>
        </>
      )}
    </div>
  );
};

export default VerifyEmail;
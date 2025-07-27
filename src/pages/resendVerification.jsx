import React, { useState } from "react";
import { Link } from "react-router-dom";
const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000";

const ResendVerification = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSuccess(false);
    try {
      const res = await fetch(`${API_BASE}/user/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSuccess(true);
        setMessage("Verification email resent! Please check your inbox.");
      } else {
        setMessage(data.message || "Could not resend verification email.");
      }
    } catch {
      setMessage("Network error. Please try again.");
    }
  };

  return (
    <div
      className="resend-verification-page"
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
      <h2 style={{ color: "#1976d2", marginBottom: 16 }}>Resend Verification Email</h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 18 }}>
        <label htmlFor="email" style={{ display: "block", marginBottom: 8, color: "#333" }}>
          Email address
        </label>
        <input
          type="email"
          id="email"
          value={email}
          required
          onChange={e => setEmail(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            borderRadius: 6,
            border: "1px solid #ccc",
            marginBottom: 12,
            fontSize: 16
          }}
        />
        <button
          type="submit"
          style={{
            background: "#1976d2",
            color: "#fff",
            padding: "10px 24px",
            borderRadius: 6,
            border: "none",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Resend Email
        </button>
      </form>
      {message && (
        <div style={{ color: success ? "green" : "red", marginTop: 10 }}>
          {message}
        </div>
      )}
      <p style={{ marginTop: 18, color: "#555", fontSize: 15 }}>
        Already verified? <Link to="/login" style={{ color: "#1976d2", textDecoration: "underline" }}>Go to Login</Link>
      </p>
    </div>
  );
};

export default ResendVerification;
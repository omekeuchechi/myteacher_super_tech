import { useState } from "react";

const whatsappInfoStyles = {
    position: "fixed",
    right: "60px",
    bottom: "32px",
    zIndex: 1000,
    background: "#25D366",
    color: "#fff",
    borderRadius: "16px",
    boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
    padding: "20px 28px 18px 24px",
    minWidth: "260px",
    maxWidth: "320px",
    fontFamily: "inherit",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    border: "2px solid #fff",
    transition: "box-shadow 0.2s, transform 0.2s",
    perspective: "800px"
};

const whatsappLinkStyles = {
    color: "#fff",
    fontWeight: 700,
    textDecoration: "underline",
    wordBreak: "break-all",
};

const iconButtonStyle = {
    background: "none",
    border: "none",
    color: "#fff",
    fontSize: "1.3rem",
    cursor: "pointer",
    position: "absolute",
    top: "10px",
    right: "14px",
    zIndex: 2,
};

const miniIconWrapper = {
    ...whatsappInfoStyles,
    background: "#25D366",
    minWidth: "unset",
    maxWidth: "unset",
    padding: "10px",
    borderRadius: "50%",
    boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "54px",
    height: "54px",
    cursor: "pointer",
    perspective: "800px"
};

const WhatAppInfo = () => {
    const [minimized, setMinimized] = useState(false);
    const [animating, setAnimating] = useState(false);

    // Handle minimize with animation that will
    // make the component look like it's being minimized
    const handleMinimize = () => {
        setAnimating(true);
        setTimeout(() => {
            setMinimized(true);
            setAnimating(false);
        }, 600);
    };

    // Handle restore with animation
    // This will restore the component to its original state
    const handleRestore = () => {
        setAnimating(true);
        setMinimized(false);
        setTimeout(() => setAnimating(false), 700);
    };

    return minimized ? (
        <div
            style={miniIconWrapper}
            className={animating ? "whatsapp-3d-animate" : ""}
            onClick={handleRestore}
            title="Contact us on WhatsApp"
        >
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp Logo"
                style={{ width: "32px", height: "32px" }}
            />
        </div>
    ) : (
        <div
            className={`whatsapp-info${animating ? " whatsapp-3d-minimize" : " whatsapp-3d-animate"}`}
            style={whatsappInfoStyles}
        >
            <button
                style={iconButtonStyle}
                aria-label="Close WhatsApp Info"
                onClick={handleMinimize}
            >
                <i className="fas fa-xmark"></i>
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                    alt="WhatsApp Logo"
                    style={{ width: "24px", height: "24px" }}
                />
                <h2 style={{ fontSize: "1.25rem", margin: 0, fontWeight: 800, letterSpacing: "0.2px" }}>
                    WhatsApp Us
                </h2>
            </div>
            <h2 style={{ fontSize: "1.15rem", margin: 0, marginBottom: "6px", fontWeight: 800, letterSpacing: "0.2px" }}>
                Contact Us on WhatsApp
            </h2>
            <p style={{ fontSize: "1rem", margin: 0, fontWeight: 400 }}>
                For more information, reach out to us on WhatsApp at{" "}
                <a
                    href="https://wa.me/2349031592480"
                    style={whatsappLinkStyles}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    +2349031592480
                </a>
            </p>
        </div>
    );
};

export default WhatAppInfo;
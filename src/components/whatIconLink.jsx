import { useState } from "react";

const miniIconWrapper = {
  position: "fixed",
  right: "60px",
  bottom: "32px",
  zIndex: 1000,
  background: "#25D366",
  width: "60px",
  height: "60px",
  borderRadius: "50%",
  boxShadow: "0 4px 24px rgba(0,0,0,0.13)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  transition: "transform 0.2s",
};

const WhatsAppIconOnly = () => {
  const [minimized, setMinimized] = useState(false);
  const whatsappUrl = "https://wa.me/2349031592480";

  const handleRestore = () => {
    setMinimized(false);
  };

  return minimized ? (
    // Show a round icon to restore
    <div
      style={miniIconWrapper}
      onClick={handleRestore}
      title="Contact us on WhatsApp"
    >
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Logo"
        style={{ width: "36px", height: "36px", borderRadius: "50%" }}
      />
    </div>
  ) : (
    // Show a round link icon that opens WhatsApp chat
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ textDecoration: "none" }}
    >
      <div style={miniIconWrapper} title="Chat on WhatsApp">
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
          alt="WhatsApp Logo"
          style={{ width: "36px", height: "36px", borderRadius: "50%" }}
        />
      </div>
    </a>
  );
};

export default WhatsAppIconOnly;
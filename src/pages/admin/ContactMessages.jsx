import React, { useContext, useEffect, useState } from "react";
import AdminNav from "../../components/adminCom/navSection";
import { AuthContext } from "../../../context/Authcontext";

const API_BASE = import.meta.env.VITE_BASEURL || "http://localhost:5000/api/v1";

const navLinks = [
  { to: "/", label: "Home" },
  { to: "/admin/ui-settings", label: "UI Settings" },
  { to: "/admin/take-lecture", label: "Take Lecture" },
  { to: "/admin/profile", label: "Profile" },
  { to: "/admin/users", label: "Users" },
  { to: "/admin/transactions", label: "Transactions" },
  { to: "/admin/enrollments", label: "Enrollment" },
  { to: "/admin/admin-list", label: "Admin List" },
  { to: "/admin/contact-messages", label: "Contact Messages" },
  { to: "/admin/publish-asset", label: "Publish Asset" },
  { to: "/admin/post-blog", label: "Post Blog" },
];

const ContactMessages = () => {
  const { logout } = useContext(AuthContext);

  return (
    <>
      <AdminNav navLinks={navLinks} onLogout={logout} />
      <div>
        <h2>Contact Messages</h2>
        <p>View and respond to contact messages here.</p>
      </div>
    </>
  );
};

export default ContactMessages;
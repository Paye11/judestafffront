
import React from "react";
import "../styles/sidebar.css";

export default function SidebarMenuItem({ icon, label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`sidebar-menu-item ${active ? "sidebar-menu-item-active" : ""}`}
    >
      {React.createElement(icon, { className: "sidebar-icon" })}
      <span className="sidebar-label">{label}</span>
    </div>
  );
}

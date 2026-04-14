

import React, { useState, useEffect, useCallback } from "react";
import {
  FaTachometerAlt,
  FaBuilding,
  FaLandmark,
  FaSitemap,
  FaUsers,
  FaUserCheck,
  FaUserClock,
  FaUserTimes,
  FaTrashRestore,
  FaCog,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import SidebarHeader from "./SidebarHeader";
import "../styles/sidebar.css";

export default function Sidebar() {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);

  /** Handle screen resize efficiently */
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setSidebarOpen(!mobile);
  }, []);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  /** Menu Items */
  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: FaTachometerAlt },
    { key: "circuit-courts", label: "Circuit Courts", icon: FaBuilding },
    { key: "magisterial-courts", label: "Magisterial Courts", icon: FaLandmark },
    { key: "departments", label: "Departments", icon: FaSitemap },
    { key: "total-staff", label: "View Total Staff", icon: FaUsers },
    { key: "active-staff", label: "Active Staff", icon: FaUserCheck },
    { key: "retired-staff", label: "Retired Staff", icon: FaUserClock },
    { key: "dismissed-staff", label: "Dismissed Staff", icon: FaUserTimes },
    { key: "on-leave-staff", label: "On Leave Staff", icon: FaUserClock },
    { key: "recycle-bin", label: "Recycle Bin", icon: FaTrashRestore },
    { key: "settings", label: "Settings", icon: FaCog },
  ];

  /** Handle logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", { replace: true });
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      {isMobile && (
        <button
          className="sidebar-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-label={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
        >
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
      )}

      {/* Mobile Overlay */}
      {isMobile && sidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`sidebar ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
      >
        <SidebarHeader />

        <nav className="sidebar-menu">
          {menuItems.map(({ key, label, icon }) => (
            <NavLink
              key={key}
              to={`/admin/${key}`}
              className={({ isActive }) =>
                `sidebar-menu-item ${
                  isActive ? "sidebar-menu-item-active" : ""
                }`
              }
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              {React.createElement(icon, { className: "sidebar-icon" })}
              <span className="sidebar-label">{label}</span>
            </NavLink>
          ))}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="sidebar-menu-item sidebar-logout-btn"
          >
            <FaSignOutAlt className="sidebar-icon" />
            <span className="sidebar-label">Logout</span>
          </button>
        </nav>
      </aside>
    </>
  );
}

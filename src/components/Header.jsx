// components/Header.jsx
import React, { useEffect, useState } from "react";
import "../Header.css"; // Adjust path if needed
import logo from "../assets/main-logo.png"; // Adjust path if needed

export default function Header({ loggedInUser, setLoggedInUser, setShowModal }) {
  const [showProfile, setShowProfile] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, [setLoggedInUser]);

  function toggleProfile() {
    setShowProfile((prev) => !prev);
  }

  function logout() {
    setLoggedInUser(null);
    setShowProfile(false);
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  }

  return (
    <header className="header">
      <img src={logo} alt="ImaginAI Logo" className="header-logo" />

      {loggedInUser ? (
        <div className="profile-container" style={{ position: "relative" }}>
          <button className="profile-btn" onClick={toggleProfile} aria-label="User Profile">
            <div className="profile-avatar-circle">
              {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}
            </div>
          </button>

          {showProfile && (
            <div className="profile-dropdown">
              <div className="profile-header">
                <div className="profile-avatar-circle">
                  {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}
                </div>
                <span className="profile-username">
                  {loggedInUser.username || loggedInUser.email}
                </span>
              </div>
              <div className="profile-actions">
                <button className="profile-action-btn" disabled>
                  ⚙️ Settings
                </button>
                <button className="profile-action-btn" disabled>
                  🔔 Notifications
                </button>
                <button className="profile-action-btn" onClick={logout}>
                  🚪 Logout
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <button className="login-btn" onClick={() => setShowModal(true)}>
          Login
        </button>
      )}
    </header>
  );
}

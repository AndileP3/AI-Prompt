// components/UserInfoPanel.jsx
import { useEffect, useState } from "react";

// Add props: setShowModal
export default function UserInfoPanel({ setShowModal }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
    setUser(storedUser);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    window.location.reload();
  };

  return (
    <aside className="user-info-panel">
      <div className="user-header">
        <div className="user-avatar">
          {user?.username ? user.username[0].toUpperCase() : "U"}
        </div>
        <div className="user-details">
          <div className="user-name">{user?.username || "Guest User"}</div>
          <div className="user-email">{user?.email || "Not logged in"}</div>
        </div>
      </div>
{/* 
      <div className="user-actions">
        <button className="action-button">Liked Posts</button>
        <button className="action-button">Feed Preference</button>
        <button className="action-button">Country</button>
      </div> */}

      <div className="auth-button-wrapper">
        {user ? (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <button className="login-button" onClick={() => setShowModal(true)}>
            Login
          </button>
        )}
      </div>
    </aside>
  );
}

// components/UserInfoPanel.jsx
import { useEffect, useState } from "react";

// Add props: setShowModal
export default function UserInfoPanel({ setShowModal }) {
  const [user, setUser] = useState(null);
  const [feedback, setFeedback] = useState("");

const handleFeedbackSubmit = () => {
  if (!feedback.trim()) return alert("Please write something before submitting.");

  // Example: console log or later send to server
  console.log("User feedback:", feedback);

  alert("Thank you for your feedback!");
  setFeedback(""); // Clear textarea
};

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
{user && (
  <div className="user-feedback-form">
    <h4>We value your feedback</h4>
    <textarea
      placeholder="Share your thoughts..."
      rows={3}
      className="feedback-textarea"
      value={feedback}
      onChange={(e) => setFeedback(e.target.value)}
    ></textarea>
    <button className="submit-feedback-button" onClick={handleFeedbackSubmit}>
      Submit
    </button>
  </div>
)}

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

// components/AuthModal.jsx
import { useState } from "react";
import "../Header.css";

export default function AuthModal({ showModal, setShowModal, setLoggedInUser }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function closeModal() {
    setShowModal(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setIsSignUp(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const endpoint = isSignUp
        ? "http://localhost/AI/save_user.php"
        : "http://localhost/AI/login.php";

      const body = isSignUp
        ? { username, email, password }
        : { email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const text = await res.text();
      const data = JSON.parse(text);

      if (data.success) {
        alert(isSignUp ? "Account created successfully!" : "Signed in successfully!");
        const userData = {
          user_id: data.user_id,
          username: data.username,
          email: data.email,
        };
        setLoggedInUser(userData);
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        closeModal();
        window.location.reload();
      } else {
        alert("Error: " + (data.message || "Failed to authenticate"));
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  }

  if (!showModal) return null;

  return (
    <div className="Auth-modal" onClick={closeModal}>
      <div className="Auth-modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{isSignUp ? "Create Account" : "Sign In"}</h2>
        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <input
              className="modal-input"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          )}
          <input
            className="modal-input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="modal-input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="modal-submit-btn">
            {isSignUp ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <p style={{ marginTop: 10 }}>
          {isSignUp ? "Already have an account? " : "Don't have an account? "}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="modal-toggle-btn"
            type="button"
          >
            {isSignUp ? "Sign In" : "Sign Up"}
          </button>
        </p>
        <button onClick={closeModal} className="modal-close-btn">
          ×
        </button>
      </div>
    </div>
  );
}

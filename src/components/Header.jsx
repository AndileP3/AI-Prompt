import React, { useState, useEffect } from "react";
import "../Header.css"; // Adjust path as needed

export default function Header({ loggedInUser, setLoggedInUser }) {
  const [showModal, setShowModal] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showProfile, setShowProfile] = useState(false);

  // Load persisted user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      setLoggedInUser(JSON.parse(storedUser));
    }
  }, [setLoggedInUser]);

  function closeModal() {
    setShowModal(false);
    setUsername("");
    setEmail("");
    setPassword("");
    setIsSignUp(false);
  }

  function openModal() {
    setShowModal(true);
  }

  function toggleProfile() {
    setShowProfile((prev) => !prev);
  }

  function logout() {
    setLoggedInUser(null);
    setShowProfile(false);
    localStorage.removeItem("loggedInUser");
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      if (isSignUp) {
        const res = await fetch("http://localhost/AI/save_user.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, email, password }),
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (data.success) {
          alert("Account created successfully!");
          const userData = {
            user_id: data.user_id,
            username: data.username,
            email: data.email,
          };
          setLoggedInUser(userData);
          localStorage.setItem("loggedInUser", JSON.stringify(userData));
          closeModal();
        } else {
          alert("Error: " + (data.message || "Failed to create account"));
        }
      } else {
        const res = await fetch("http://localhost/AI/login.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        const text = await res.text();
        const data = JSON.parse(text);

        if (data.success) {
          alert("Signed in successfully!");
          const userData = {
            user_id: data.user_id,
            username: data.username,
            email: data.email,
          };
          setLoggedInUser(userData);
          localStorage.setItem("loggedInUser", JSON.stringify(userData));
          closeModal();
        } else {
          alert("Error: " + (data.message || "Invalid credentials"));
        }
      }
    } catch (error) {
      alert("Network error: " + error.message);
    }
  }

  return (
    <>
      <header className="header">
        <h1 className="header-title">ImaginAI</h1>

        {loggedInUser ? (
          <div className="profile-container" style={{ position: "relative" }}>
            <button
              className="profile-btn"
              onClick={toggleProfile}
              aria-label="User Profile"
            >
              👤
            </button>

            {showProfile && (
              <div
                className="profile-dropdown"
                style={{
                  position: "absolute",
                  right: 0,
                  color: "black",
                  background: "#fff",
                  border: "1px solid #ccc",
                  padding: "10px",
                  borderRadius: "4px",
                  marginTop: "5px",
                  minWidth: "150px",
                  zIndex: 100,
                }}
              >
                <p>
                  <strong>{loggedInUser.username || loggedInUser.email}</strong>
                </p>
                <button onClick={logout} style={{ marginTop: "10px" }}>
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={openModal}>
            Login
          </button>
        )}
      </header>

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
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
            <button
              onClick={closeModal}
              className="modal-close-btn"
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </>
  );
}

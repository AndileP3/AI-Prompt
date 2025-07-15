// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SuggestionCard from "./components/SuggestionCard";
import ImageView from "./components/ImageView";
import Post from "./components/Post";
import Header from "./components/Header";
import ShareCreation from "./components/ShareCreation";
import LoadingScreen from "./components/LoadingScreen";
import UserInfoPanel from "./components/UserInfoPanel";
import NotificationsPanel from "./components/NotificationsPanel";
import AuthModal from "./components/AuthModal"; // ⬅️ Shared modal component
import "./index.css";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [submissions, setSubmissions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false); // ⬅️ Shared modal state

  useEffect(() => {
    const startTime = Date.now();

    fetch("https://keailand.ct.ws/get_posts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFetchedSuggestions(data.posts);
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      })
      .catch((err) => console.error("Network error:", err))
      .finally(() => {
        const elapsed = Date.now() - startTime;
        const remaining = 1500 - elapsed;

        if (remaining > 0) {
          setTimeout(() => setLoading(false), remaining);
        } else {
          setLoading(false);
        }
      });
  }, []);

  const allSuggestions = fetchedSuggestions;

  const filteredSuggestions =
    selectedCategory === "All"
      ? allSuggestions
      : allSuggestions.filter((s) => s.category === selectedCategory);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <div>
              <Header
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
                setShowModal={setShowModal} // ⬅️ Pass down to Header
              />

              <main className="main-content three-column-layout">
                <UserInfoPanel
                  user={loggedInUser}
                  setShowModal={setShowModal} // ⬅️ Pass down to UserInfoPanel
                />

                <div className="center-column">
                  <ShareCreation
                    submissions={submissions}
                    setSubmissions={setSubmissions}
                    loggedInUser={loggedInUser}
                  />
                  <section className="posts-section">
                    <h2 className="suggestions-title">✨ Posts</h2>
                    <div className="suggestions-list">
                      {filteredSuggestions.map((s) => (
                        <SuggestionCard key={s.post_id} postId={s.post_id} />
                      ))}
                    </div>
                  </section>
                </div>

                <NotificationsPanel />
              </main>

              {/* Shared login/signup modal */}
              <AuthModal
                showModal={showModal}
                setShowModal={setShowModal}
                setLoggedInUser={setLoggedInUser}
              />
            </div>
          }
        />

        <Route path="/post/:id" element={<Post />} />
        <Route path="/image/:postId" element={<ImageView />} />
      </Routes>
    </BrowserRouter>
  );
}

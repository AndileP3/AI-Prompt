// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import SuggestionCard from "./components/SuggestionCard";
import ImageView from "./components/ImageView";
import Post from "./components/Post";
import Header from "./components/Header";
import ShareCreation from "./components/ShareCreation";
import LoadingScreen from "./components/LoadingScreen";
import "./index.css";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [submissions, setSubmissions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();

    fetch("http://localhost/AI/get_posts.php")
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
        {/* Home Page */}
        <Route
          path="/"
          element={
            <div>
              <Header
                loggedInUser={loggedInUser}
                setLoggedInUser={setLoggedInUser}
              />
              <main className="main-content">
                <ShareCreation
                  submissions={submissions}
                  setSubmissions={setSubmissions}
                  loggedInUser={loggedInUser}
                />
                <section className="posts-section">
                  <h2 className="suggestions-title">✨ Posts</h2>
                  <div className="suggestions-grid">
                    {filteredSuggestions.map((s) => (
                      <SuggestionCard key={s.post_id} postId={s.post_id} />
                    ))}
                  </div>
                </section>
              </main>
            </div>
          }
        />
        {/* Single Post Page */}
        <Route path="/post/:id" element={<Post />} />
        {/* Fullscreen Image View */}
        <Route path="/image/:postId" element={<ImageView />} />
      </Routes>
    </BrowserRouter>
  );
}

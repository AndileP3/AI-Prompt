// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { suggestions as staticSuggestions } from "./data/suggestions";
import SuggestionCard from "./components/SuggestionCard";
import Header from "./components/Header";
import ShareCreation from "./components/ShareCreation";
import Post from "./components/Post";
import LoadingScreen from "./components/LoadingScreen"; // Import your loading screen
import "./index.css";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [submissions, setSubmissions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state

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
      const remaining = 1500 - elapsed; // 2000ms = 2 seconds

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

  // Show loading screen while fetching
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

              {/* If you want to re-enable filters, uncomment this */}
              {/*
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
              */}

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
      </Routes>
    </BrowserRouter>
  );
}

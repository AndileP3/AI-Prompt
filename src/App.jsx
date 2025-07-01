// App.jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { suggestions as staticSuggestions } from "./data/suggestions";
import SuggestionCard from "./components/SuggestionCard";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import ShareCreation from "./components/ShareCreation";
import Post from "./components/Post"; // Import Post component
import "./index.css";

export default function App() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [submissions, setSubmissions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [fetchedSuggestions, setFetchedSuggestions] = useState([]);

  useEffect(() => {
    fetch("http://localhost/AI/get_posts.php")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setFetchedSuggestions(data.posts);
        } else {
          console.error("Failed to fetch posts:", data.message);
        }
      })
      .catch((err) => console.error("Network error:", err));
  }, []);

  const allSuggestions = fetchedSuggestions;

  const filteredSuggestions =
    selectedCategory === "All"
      ? allSuggestions
      : allSuggestions.filter((s) => s.category === selectedCategory);

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
              <FilterBar
                selectedCategory={selectedCategory}
                onCategoryChange={setSelectedCategory}
              />
           <main className="main-content">
  <ShareCreation
    submissions={submissions}
    setSubmissions={setSubmissions}
    loggedInUser={loggedInUser}
  />

  <section className="posts-section">
    <h2 className="suggestions-title">✨Posts</h2>
    <div className="suggestions-grid">
      {filteredSuggestions.map((s) => (
        <SuggestionCard
          key={s.post_id}
          prompt={s.prompt}
          image={s.image}
          postId={s.post_id}
        />
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

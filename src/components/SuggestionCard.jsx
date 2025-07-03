import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SuggestionCard({ postId }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    fetch(`http://localhost/AI/get_single_post.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        } else {
          console.error("Failed to fetch post:", data.message);
        }
      })
      .catch((err) => console.error("Network error:", err));
  }, [postId]);

  if (!post) {
    return (
      <div className="suggestion-card">
        <div className="suggestion-card-content">
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  const { username, prompt, image } = post;

  return (
    <div
      className="suggestion-card"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/post/${postId}`)}
    >
      {/* Top: Avatar and Username */}
      <div className="suggestion-card-header">
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
        <span className="username">{username}</span>
      </div>

      {/* Message */}
      <div
        className="suggestion-card-message"
        onClick={(e) => e.stopPropagation()}
      >
        <p className={expanded ? "expanded" : ""}>{prompt}</p>
        {prompt.length > 100 && (
          <button
            className="see-more-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}
      </div>

      {/* Image */}
      <img
        src={image}
        alt={prompt}
        className={expanded ? "image-collapsed" : ""}
      />

      {/* Like Button */}
      <div className="suggestion-card-footer">
        <button
          className={`like-button ${liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked(!liked);
          }}
        >
          <span className="heart">♥</span>
          <span className="like-text">{liked ? "Liked" : "Like"}</span>
        </button>
      </div>
    </div>
  );
}

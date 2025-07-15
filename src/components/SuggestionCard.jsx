import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SuggestionCard({ postId }) {
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [liked, setLiked] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [timeAgo, setTimeAgo] = useState("");
  const [likesCount, setLikesCount] = useState(0);
  const [commentsCount, setCommentsCount] = useState(0);

  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
    if (likedPosts.includes(postId)) setLiked(true);

    fetch(`https://keailand.bluenroll.co.za/get_single_post.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
          setLikesCount(data.post.likes_count || 0);

          const createdAt = new Date(data.post.date);
          const now = new Date();
          const diffMs = now - createdAt;
          const totalMinutes = Math.floor(diffMs / (1000 * 60));
          const minutes = totalMinutes % 60;
          const totalHours = Math.floor(totalMinutes / 60);
          const hours = totalHours % 24;
          const days = Math.floor(totalHours / 24);
          let timeStr = "";
          if (days > 0) timeStr += `${days}d${hours > 0 ? ` ${hours}h` : ""}`;
          else if (totalHours > 0) timeStr += `${totalHours}h${minutes > 0 ? ` ${minutes}m` : ""}`;
          else timeStr += `${minutes}m`;
          setTimeAgo(timeStr);
        }
      });

    fetch(`https://keailand.bluenroll.co.za/get_comments_count.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCommentsCount(data.count);
        }
      });
  }, [postId]);

  const handleLike = (e) => {
    e.stopPropagation();
    if (!liked && storedUser) {
      fetch(`https://keailand.bluenroll.co.za/like_post.php`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `post_id=${postId}&user_id=${storedUser.user_id}&username=${storedUser.username}`,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setLikesCount((prev) => prev + 1);
            setLiked(true);
            const likedPosts = JSON.parse(localStorage.getItem("likedPosts") || "[]");
            likedPosts.push(postId);
            localStorage.setItem("likedPosts", JSON.stringify(likedPosts));
          }
        });
    }
  };

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
let images = [];
try {
  images = Array.isArray(post.image) ? post.image : JSON.parse(post.image);
} catch {
  images = [];
}


try {
  images = typeof post.image === "string"
    ? JSON.parse(post.image)
    : Array.isArray(post.image)
    ? post.image
    : [];
} catch (err) {
  console.error("Invalid image JSON:", post.image);
}


  return (
    <div className="suggestion-card" style={{ cursor: "pointer" }}>
      <div className="suggestion-card-header" onClick={() => navigate(`/post/${postId}`)}>
        <div className="avatar">{username.charAt(0).toUpperCase()}</div>
        <span className="username">{username}</span>
        <span className="time-ago">{timeAgo}</span>
      </div>

      <div className="suggestion-card-message" onClick={(e) => e.stopPropagation()}>
        {prompt && (
          <>
            <p className={expanded ? "expanded" : ""}>{prompt}</p>
            {prompt.length > 100 && (
              <button className="see-more-button" onClick={() => setExpanded(!expanded)}>
                {expanded ? "See less" : "See more"}
              </button>
            )}
          </>
        )}
      </div>
          {images.length > 0 && (
            <div
              className={`post-images-container images-${images.length}`}
              onClick={() => navigate(`/image/${postId}`)} // Redirects when images are clicked
              style={{ cursor: "pointer" }}
            >
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`post-${idx}`}
                  className="post-image"
                />
              ))}
            </div>
          )}




      <div className="suggestion-card-footer">
  <div className="footer-stats-row">
    <div className="likes-summary">
      <span className="like-count">{likesCount}</span>
      <span className="heart">♥</span>
    </div>
    <div className="comments-summary"
          onClick={(e) => {
        e.stopPropagation();
        navigate(`/image/${postId}`);
      }}
      >
      <span>{commentsCount} Comment{commentsCount !== 1 && "s"}</span>
    </div>
  </div>

  <hr className="footer-divider" />

  <div className="footer-actions">
    <button className={`like-button ${liked ? "liked" : ""}`} onClick={handleLike}>
      <span className="like-text">{liked ? "Liked" : "Like"}</span>
    </button>

    <div
      className="comment-button"
      onClick={(e) => {
        e.stopPropagation();
        navigate(`/image/${postId}`);
      }}
    >
      Comment
    </div>
  </div>
</div>

    </div>
  );
}

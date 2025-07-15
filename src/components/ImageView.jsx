import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

export default function ImageView() {
  const { postId } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState(null);
  const [showTextFull, setShowTextFull] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const touchStartX = useRef(null);
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    fetch(`http://localhost/AI/get_single_post.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        }
      });

    fetch(`http://localhost/AI/get_comments.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setComments(data.comments);
        }
      });
  }, [postId]);

  const handleSubmitComment = () => {
    if (!storedUser) {
      setError("You must be logged in to comment.");
      return;
    }

    const trimmedComment = newComment.trim();
    if (trimmedComment === "") return;

    const numericPostId = parseInt(postId, 10);
    if (isNaN(numericPostId)) {
      setError("Invalid post ID.");
      return;
    }

    setLoadingComment(true);
    setError(null);

    fetch(`http://localhost/AI/add_comment.php`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        post_id: numericPostId,
        user_id: storedUser.user_id,
        comment_text: trimmedComment,
        username: storedUser.username,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingComment(false);
        if (data.success) {
          setComments((prev) => [...prev, { username: storedUser.username, text: trimmedComment }]);
          setNewComment("");
        } else {
          setError(data.message || "Failed to add comment.");
        }
      })
      .catch((err) => {
        setLoadingComment(false);
        setError("Error posting comment.");
        console.error("Error posting comment:", err);
      });
  };

  if (!post) return <p>Loading...</p>;

  const { username, prompt } = post;

  let images = [];
  try {
    images = Array.isArray(post.image) ? post.image : JSON.parse(post.image);
  } catch {
    images = typeof post.image === "string" ? [post.image] : [];
  }

  const showPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const showNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const handleTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (deltaX > 50) showPrev();
    else if (deltaX < -50) showNext();
    touchStartX.current = null;
  };

  return (
    <div className="image-view-container">
      <button className="image-view-close-x" onClick={() => navigate(-1)}>×</button>

      <div
        className={`image-view-scroll ${showTextFull ? "shrink" : ""}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {images.length > 1 && (
          <>
            <button className="arrow-button left" onClick={showPrev}>‹</button>
            <button className="arrow-button right" onClick={showNext}>›</button>
          </>
        )}
        {images.length > 0 && (
          <img
            src={images[currentIndex]}
            alt={`post-${currentIndex}`}
            className="image-view-full"
          />
        )}
      </div>

      <button
        className="toggle-layout-button"
        onClick={() => setShowTextFull(!showTextFull)}
      >
        ↕
      </button>

      <div className={`image-view-text ${showTextFull ? "expanded-text" : ""}`}>
        <div className="post-author">
          <div className="avatar">{username[0]?.toUpperCase()}</div>
          <span className="author-name">{username}</span>
        </div>

        <p className={expanded ? "expanded" : ""}>{prompt}</p>
        {prompt.length > 100 && (
          <button className="see-more-button" onClick={() => setExpanded(!expanded)}>
            {expanded ? "See less" : "See more"}
          </button>
        )}

        <div className="comment-form">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loadingComment || !storedUser}
          />
          <button onClick={handleSubmitComment} disabled={loadingComment || !storedUser}>
            {loadingComment ? "Posting..." : "Post Comment"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>

        <div className="image-view-comments">
          <h5>Comments:</h5>
          {comments.length === 0 ? (
            <p>Be the first to comment!</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment">
                <div className="comment-header">
                  <div className="avatar">{c.username[0]?.toUpperCase()}</div>
                  <strong>{c.username}</strong>
                </div>
                <p>{c.text}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

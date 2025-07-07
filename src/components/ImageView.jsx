import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ImageView() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComment, setLoadingComment] = useState(false);
  const [error, setError] = useState(null);

  // ✅ Load the logged-in user from localStorage
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));
  console.log("Loaded loggedInUser from localStorage:", storedUser);

  useEffect(() => {
    // Fetch the single post details
    fetch(`http://localhost/AI/get_single_post.php?post_id=${postId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setPost(data.post);
        }
      });

    // Fetch comments for the post
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
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setLoadingComment(false);
        if (data.success) {
          setComments((prevComments) => [
            ...prevComments,
            { username: storedUser.username, text: trimmedComment },
          ]);
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

  const { username, prompt, image } = post;

  return (
    <div className="image-view-container">
      <button className="image-view-close-x" onClick={() => navigate(-1)}>
        ×
      </button>

      <img src={image} alt={prompt} className="image-view-full" />

      <div className="image-view-text">
        <h4>{username}</h4>
        <p className={expanded ? "expanded" : ""}>{prompt}</p>
        {prompt.length > 100 && (
          <button
            className="see-more-button"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "See less" : "See more"}
          </button>
        )}

        <div className="image-view-comments">
          <h5>Comments:</h5>
          {comments.length === 0 ? (
            <p>No comments yet.</p>
          ) : (
            comments.map((c, i) => (
              <div key={i} className="comment">
                <strong>{c.username}</strong>: {c.text}
              </div>
            ))
          )}
        </div>

        <div className="comment-form">
          <textarea
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={loadingComment || !storedUser}
          />
          <button
            onClick={handleSubmitComment}
            disabled={loadingComment || !storedUser}
          >
            {loadingComment ? "Posting..." : "Post Comment"}
          </button>
          {error && <p className="error-message">{error}</p>}
        </div>
      </div>
    </div>
  );
}

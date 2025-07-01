import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import SuggestionCard from "./SuggestionCard";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [totalPosts, setTotalPosts] = useState(0);

useEffect(() => {
  fetch(`http://localhost/AI/get_single_post.php?post_id=${id}`)
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        setPost(data.post);
        fetch(`http://localhost/AI/get_posts_by_user.php?user_id=${data.post.user_id}`)
          .then(res => res.json())
          .then(userData => {
            if (userData.success) {
              setUserPosts(userData.posts);
              setTotalPosts(userData.total_posts);
            } else {
              console.error(userData.message);
            }
          })
          .catch(err => console.error("Error fetching user posts:", err));
      } else {
        console.error(data.message);
      }
      setLoading(false);
    })
    .catch(err => {
      console.error("Error fetching post:", err);
      setLoading(false);
    });
}, [id]);


  if (loading) {
    return <div className="loading">Loading post...</div>;
  }

  if (!post) {
    return (
      <div className="error">
        <p>Post not found.</p>
        <button onClick={() => navigate("/")}>← Back</button>
      </div>
    );
  }

  return (
    <div>
      <Header loggedInUser={loggedInUser} setLoggedInUser={setLoggedInUser} />

      {/* Back Button */}
      <button className="back-button-fixed" onClick={() => navigate("/")}>
        ← Back
      </button>

      <div className="post-layout">
        {/* Left Sidebar */}
        <aside className="user-sidebar">
          <div className="user-card">
            <div className="avatar-circle-large">
              {post.username[0].toUpperCase()}
            </div>
            <h3>@{post.username}</h3>
            <p>User ID: {post.user_id}</p>
          <p>Total Posts: {userPosts.length}</p>
          </div>
        </aside>

        {/* Right Content */}
        <main className="user-posts">
          <section className="main-post">
            <img
              src={post.image}
              alt="Post"
              className="post-image-large"
            />
            <div className="post-content">
              <h3>@{post.username}</h3>
              <p>{post.prompt}</p>
            </div>
          </section>

          <section className="other-posts">
            <h4>All posts from @{post.username}</h4>
            <div className="suggestions-grid">
              {userPosts.map((s) => (
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
    </div>
  );
}

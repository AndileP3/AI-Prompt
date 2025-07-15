import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "./Header";
import SuggestionCard from "./SuggestionCard";

export default function Post() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);

  useEffect(() => {
    // First, fetch the clicked post to get the user_id
    fetch(`https://keailand.bluenroll.co.za/get_single_post.php?post_id=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const post = data.post;

          // Fetch all posts by this user
          fetch(`https://keailand.bluenroll.co.za/get_posts_by_user.php?user_id=${post.user_id}`)
            .then((res) => res.json())
            .then((userData) => {
              if (userData.success) {
                // Filter out the post the user clicked
                const otherPosts = userData.posts.filter(
                  (p) => p.post_id !== id
                );
                setUser({
                  username: post.username,
                  user_id: post.user_id,
                  total_posts: userData.total_posts,
                });
                setUserPosts(otherPosts);
              } else {
                console.error(userData.message);
              }
              setLoading(false);
            })
            .catch((err) => {
              console.error("Error fetching user posts:", err);
              setLoading(false);
            });
        } else {
          console.error(data.message);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Error fetching post:", err);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="error">
        <p>User not found.</p>
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
    <div className="user-info">
      <div className="avatar-circle-large">
        {user.username[0].toUpperCase()}
      </div>
      <div className="user-text">
        <h3>@{user.username}</h3>
        <p className="user-id">User ID: {user.user_id}</p>
        <p>Total Posts: {user.total_posts}</p>
      </div>
    </div>
  </div>
</aside>


        {/* Main Content */}
        <main className="user-posts">
          <section className="other-posts">
            <h4>Posts by @{user.username}</h4>
            {userPosts.length === 0 ? (
              <p>This user has no other posts.</p>
            ) : (
              <div className="suggestions-grid">
                {userPosts.map((s) => (
                  <SuggestionCard key={s.post_id} postId={s.post_id} />
                ))}
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}

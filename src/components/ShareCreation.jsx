import React, { useState } from "react";


export default function ShareCreation({ submissions, setSubmissions, loggedInUser }) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!prompt || !file) {
      alert("Please enter a prompt and select an image.");
      return;
    }
    if (!loggedInUser || !loggedInUser.user_id) {
      alert("You must be logged in to post.");
      return;
    }

    const formData = new FormData();
    formData.append("message", prompt);
    formData.append("image", file);
    formData.append("user_id", loggedInUser.user_id);

    try {
      const res = await fetch("http://localhost/AI/post.php", {
        method: "POST",
        body: formData,
      });

      const text = await res.text();
      console.log("SERVER RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        throw new Error("Invalid JSON: " + text);
      }

      if (data.success) {
        const imageUrl = "http://localhost/AI/uploads/" + data.filename;
        setSubmissions([{ prompt, image: imageUrl }, ...submissions]);
        setPrompt("");
        setFile(null);
        setShowModal(false);
      } else {
        alert("Error: " + (data.message || "Failed to save post"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  }

  return (
    <section className="share-container">
      {/* Input area styled like LinkedIn */}
      <div className="share-input-wrapper" onClick={() => setShowModal(true)}>
        <div className="avatar-circle">
          {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}
        </div>
        <input
          type="text"
          placeholder="Start a post"
          readOnly
        />
        <button className="inline-share-button">Share</button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="share-modal-overlay">
          <div className="share-modal">
            <h3>Create a post</h3>
            <form onSubmit={handleSubmit}>
              <textarea
                placeholder="What AI work do you want to share?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
              />
          <div className="modal-actions">
  <label className="modal-file-label">
    🖼️ Photo
    <input
      type="file"
      name="image"
      accept="image/*"
      onChange={(e) => setFile(e.target.files[0])}
      style={{ display: "none" }}
    />
  </label>
  <button type="submit" className="modal-post-button">
    Post
  </button>
</div>

            </form>
            <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
          </div>
        </div>
      )}

      {submissions.length > 0 && (
        <div className="community-submissions">
          <h4>✨ Your Post was Submitted</h4>
          {submissions.map((s, index) => (
            <div key={index} className="submission-card">
              <img src={s.image} alt={s.prompt} className="submission-image" />
              <p className="submission-prompt">{s.prompt}</p>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

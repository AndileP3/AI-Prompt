import React, { useState } from "react";

export default function ShareCreation({ submissions, setSubmissions, loggedInUser }) {
  const [prompt, setPrompt] = useState("");
  const [file, setFile] = useState(null);

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
        e.target.reset();
      } else {
        alert("Error: " + (data.message || "Failed to save post"));
      }
    } catch (err) {
      alert("Network error: " + err.message);
    }
  }

  return (
    <section className="share-container">
      <form onSubmit={handleSubmit} className="share-form-horizontal">
        <div className="share-avatar">
          {/* You can replace this with user's actual profile image */}
          <div className="avatar-circle">
            {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}
          </div>
        </div>
        <div className="share-main">
          <input
            type="text"
            name="prompt"
            placeholder="What's on your mind?"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="share-input-linkedin"
          />
          <div className="share-actions">
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              className="share-file-input"
            />
            <button type="submit" className="share-btn-linkedin">
              Share
            </button>
          </div>
        </div>
      </form>
      {submissions.length > 0 && (
        <div className="community-submissions">
          <h4>✨Your Post was Submitted</h4>
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

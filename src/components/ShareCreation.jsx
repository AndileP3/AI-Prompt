import React, { useState } from "react";

export default function ShareCreation({ submissions, setSubmissions, loggedInUser }) {
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();

    if (!prompt && files.length === 0) {
      alert("Please write something or attach at least one image.");
      return;
    }

    if (!loggedInUser || !loggedInUser.user_id) {
      alert("You must be logged in to post.");
      return;
    }

    const formData = new FormData();
    formData.append("message", prompt);
    formData.append("user_id", loggedInUser.user_id);
    files.forEach((file) => formData.append("image[]", file)); // Multiple images

    try {
      const res = await fetch("https://keailand.bluenroll.co.za/post.php", {
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
        const imageUrls = (data.filenames || []).map(
          (name) => `https://keailand.bluenroll.co.za/uploads/${name}`
        );
        setSubmissions([{ prompt, images: imageUrls }, ...submissions]);
        setPrompt("");
        setFiles([]);
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
      <div className="share-input-wrapper" onClick={() => setShowModal(true)}>
        <div className="avatar-circle">
          {loggedInUser?.username ? loggedInUser.username[0].toUpperCase() : "U"}
        </div>
        <input type="text" placeholder="Start a post" readOnly />
        <button className="inline-share-button">Share</button>
      </div>

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
                  🖼️ Photo(s)
                  <input
                    type="file"
                    name="images"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const selected = Array.from(e.target.files).slice(0, 4);
                      setFiles(selected);
                    }}
                    style={{ display: "none" }}
                  />
                  {files.length > 0 && (
  <div className="attached-files-preview">
    {files.map((file, index) => (
      <div key={index} className="file-chip">
        <span className="file-name">{file.name}</span>
        <button
          type="button"
          className="remove-file-button"
          onClick={() => {
            setFiles(files.filter((_, i) => i !== index));
          }}
        >
          ✕
        </button>
      </div>
    ))}
  </div>
)}

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
              {s.images?.length > 0 && (
                <div className={`post-images-container images-${s.images.length}`}>
                  {s.images.map((img, idx) => (
                    <img key={idx} src={img} alt={`uploaded ${idx}`} />
                  ))}
                </div>
              )}
              {s.prompt && <p className="submission-prompt">{s.prompt}</p>}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

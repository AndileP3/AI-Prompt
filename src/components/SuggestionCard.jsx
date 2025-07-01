// SuggestionCard.jsx
import { useNavigate } from "react-router-dom";

export default function SuggestionCard({ prompt, image, postId }) {
  const navigate = useNavigate();

  return (
    <div
      className="suggestion-card"
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/post/${postId}`)}
    >
      <img src={image} alt={prompt} />
      <div className="suggestion-card-content">
        <p>{prompt}</p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            navigator.clipboard.writeText(prompt);
          }}
        >
          Copy Prompt
        </button>
      </div>
    </div>
  );
}

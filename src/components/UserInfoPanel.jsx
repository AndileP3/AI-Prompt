// components/UserInfoPanel.jsx
export default function UserInfoPanel({ user }) {
  return (
    <aside className="user-info-panel">
      <div className="user-box">
        <div className="user-avatar">
          {user?.username ? user.username[0].toUpperCase() : "U"}
        </div>
        <div className="user-name">{user?.username || "Guest User"}</div>
        <p className="user-role">Web Developer</p>
      </div>
    </aside>
  );
}

// components/NotificationsPanel.jsx
export default function NotificationsPanel() {
  return (
    <aside className="notifications-panel">
      <h4 className="notif-title">🔔 Notifications</h4>
      <ul className="notif-list">
        <li>You received 3 new likes</li>
        <li>New comment on your post</li>
        <li>AI Weekly Digest available</li>
      </ul>
    </aside>
  );
}

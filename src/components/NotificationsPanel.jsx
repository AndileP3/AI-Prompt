import { useEffect, useState } from "react";

export default function NotificationsPanel() {
  const [notifications, setNotifications] = useState([]);
  const storedUser = JSON.parse(localStorage.getItem("loggedInUser"));

  useEffect(() => {
    if (storedUser) {
      fetch(`http://localhost/AI/get_notifications.php?user_id=${storedUser.user_id}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setNotifications(data.notifications);
          }
        });
    }
  }, [storedUser]);

  // ✅ Custom time formatting function
  function formatTimeDifference(timestamp) {
    const now = new Date();
    const created = new Date(timestamp);
    const diff = Math.floor((now - created) / 1000); // seconds

    const minute = 60;
    const hour = 60 * minute;
    const day = 24 * hour;
    const month = 30 * day;

    if (diff < minute) {
      return `${diff}s`;
    } else if (diff < hour) {
      const m = Math.floor(diff / minute);
      return `${m}m`;
    } else if (diff < day) {
      const h = Math.floor(diff / hour);
      const m = Math.floor((diff % hour) / minute);
      return m > 0 ? `${h}h ${m}m` : `${h}h`;
    } else if (diff < month) {
      const d = Math.floor(diff / day);
      return `${d}d`;
    } else {
      const mo = Math.floor(diff / month);
      return `${mo}mo`;
    }
  }

  return (
    <aside className="notifications-panel">
      <h4 className="notif-title">🔔Notifications</h4>
      <ul className="notif-list">
        {notifications.length === 0 ? (
          <li>No new notifications</li>
        ) : (
          notifications.map((notif, idx) => (
            <li key={idx}>
              {notif.message} <br />
              <small>{formatTimeDifference(notif.created_at)} ago</small>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}

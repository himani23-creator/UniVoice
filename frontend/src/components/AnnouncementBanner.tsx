import { useState, useEffect } from "react";
import { Announcement } from "../types";

export default function AnnouncementBanner() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/announcements")
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.data.length > 0) {
          setAnnouncements(data.data);
        }
      })
      .catch(() => {});
  }, []);

  if (!visible || announcements.length === 0) return null;

  const current = announcements[currentIdx];

  return (
    <div style={{
      background: "#EEEDFE",
      borderBottom: "0.5px solid #AFA9EC",
      padding: "10px 20px",
      display: "flex",
      alignItems: "center",
      gap: 12,
    }}>

      {current.isPinned && (
        <span style={{ fontSize: 11, background: "#534AB7", color: "#fff", padding: "2px 7px", borderRadius: 4, fontWeight: 500, flexShrink: 0 }}>
          PINNED
        </span>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 13, fontWeight: 500, color: "#3C3489", marginRight: 8 }}>
          {current.title}
        </span>
        <span style={{ fontSize: 13, color: "#534AB7" }}>
          {current.body}
        </span>
      </div>

   
      {announcements.length > 1 && (
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            onClick={() => setCurrentIdx((i) => (i - 1 + announcements.length) % announcements.length)}
            style={{ background: "none", border: "none", color: "#534AB7", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
          >‹</button>
          <span style={{ fontSize: 11, color: "#534AB7", alignSelf: "center" }}>
            {currentIdx + 1}/{announcements.length}
          </span>
          <button
            onClick={() => setCurrentIdx((i) => (i + 1) % announcements.length)}
            style={{ background: "none", border: "none", color: "#534AB7", cursor: "pointer", fontSize: 16, lineHeight: 1 }}
          >›</button>
        </div>
      )}

      <button
        onClick={() => setVisible(false)}
        style={{ background: "none", border: "none", color: "#534AB7", cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0 }}
        aria-label="Dismiss"
      >×</button>
    </div>
  );
}
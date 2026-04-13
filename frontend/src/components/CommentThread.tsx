import { useState, useEffect } from "react";
import { Comment } from "../types";

interface CommentThreadProps {
  postId: string;
  currentUserId: string;
}

export default function CommentThread({ postId, currentUserId }: CommentThreadProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newBody, setNewBody] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState("");

  useEffect(() => {
    fetchComments();
  }, [postId]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/api/comments/${postId}`);
      const data = await res.json();
      if (data.success) setComments(data.data);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBody.trim()) return;
    setSubmitting(true);

    try {
      const res = await fetch("http://localhost:3000/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ complaintId: postId, userId: currentUserId, body: newBody }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => [...prev, data.data]);
        setNewBody("");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editBody.trim()) return;
    try {
      const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: editBody, userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.map((c) => c.commentId === commentId ? data.data : c));
        setEditingId(null);
      }
    } catch {}
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Delete this comment?")) return;
    try {
      const res = await fetch(`http://localhost:3000/api/comments/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: currentUserId }),
      });
      const data = await res.json();
      if (data.success) {
        setComments((prev) => prev.filter((c) => c.commentId !== commentId));
      }
    } catch {}
  };

  const formatDate = (d: string) => new Date(d).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

  return (
    <div style={{ marginTop: 32 }}>
      <h3 style={{ fontSize: 15, fontWeight: 500, marginBottom: 16 }}>
        Comments ({comments.length})
      </h3>

      {loading ? (
        <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>Loading comments...</p>
      ) : comments.length === 0 ? (
        <p style={{ color: "var(--color-text-secondary)", fontSize: 13 }}>No comments yet. Be the first to respond.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
          {comments.map((comment) => (
            <div key={comment.commentId} style={{ padding: "12px 14px", border: "0.5px solid var(--color-border-secondary)", borderRadius: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-text-primary)" }}>
                  {comment.userId === currentUserId ? "You" : `User ${comment.userId.slice(0, 6)}`}
                </span>
                <span style={{ fontSize: 11, color: "var(--color-text-tertiary)" }}>
                  {formatDate(comment.createdAt)}
                </span>
              </div>

              {editingId === comment.commentId ? (
                <div>
                  <textarea
                    value={editBody}
                    onChange={(e) => setEditBody(e.target.value)}
                    rows={2}
                    style={{ width: "100%", padding: "8px 10px", borderRadius: 6, border: "0.5px solid var(--color-border-secondary)", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
                    <button onClick={() => handleEdit(comment.commentId)} style={{ fontSize: 12, padding: "4px 10px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer" }}>Save</button>
                    <button onClick={() => setEditingId(null)} style={{ fontSize: 12, padding: "4px 10px", background: "none", border: "0.5px solid var(--color-border-secondary)", borderRadius: 6, cursor: "pointer", color: "var(--color-text-secondary)" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <p style={{ fontSize: 13, margin: 0, color: "var(--color-text-primary)", lineHeight: 1.6 }}>{comment.body}</p>
                  {comment.userId === currentUserId && (
                    <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
                      <button onClick={() => { setEditingId(comment.commentId); setEditBody(comment.body); }} style={{ fontSize: 11, color: "#534AB7", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Edit</button>
                      <button onClick={() => handleDelete(comment.commentId)} style={{ fontSize: 11, color: "#A32D2D", background: "none", border: "none", cursor: "pointer", padding: 0 }}>Delete</button>
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}


      <form onSubmit={handleAddComment}>
        <textarea
          value={newBody}
          onChange={(e) => setNewBody(e.target.value)}
          placeholder="Write a comment..."
          rows={3}
          style={{ width: "100%", padding: "10px 12px", borderRadius: 8, border: "0.5px solid var(--color-border-secondary)", fontSize: 13, resize: "vertical", boxSizing: "border-box" }}
        />
        <button
          type="submit"
          disabled={submitting || !newBody.trim()}
          style={{ marginTop: 8, padding: "9px 20px", background: "#534AB7", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}
        >
          {submitting ? "Posting..." : "Post comment"}
        </button>
      </form>
    </div>
  );
}
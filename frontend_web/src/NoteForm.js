import React, { useState, useEffect } from "react";
import "./NoteForm.css";

// PUBLIC_INTERFACE
function NoteForm({ initial, onSave, onCancel, submitting }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setTitle(initial?.title || "");
    setContent(initial?.content || "");
    setError("");
  }, [initial]);

  // PUBLIC_INTERFACE
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return setError("Title is required");
    if (!content.trim()) return setError("Content is required");
    setError("");
    onSave({ title: title.trim(), content: content.trim() });
  };

  return (
    <form className="note-form" onSubmit={handleSubmit} autoComplete="off">
      <h2 style={{ color: "#2563EB" }}>
        {initial?.id ? "Edit Note" : "New Note"}
      </h2>
      <div className="note-form-field">
        <label htmlFor="note-title">Title</label>
        <input
          disabled={submitting}
          id="note-title"
          type="text"
          value={title}
          maxLength={100}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note title"
        />
      </div>
      <div className="note-form-field">
        <label htmlFor="note-content">Content</label>
        <textarea
          disabled={submitting}
          id="note-content"
          value={content}
          rows={5}
          maxLength={2000}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Note details"
        />
      </div>
      {error && <div className="note-form-error">{error}</div>}
      <div className="note-form-actions">
        <button
          className="note-form-btn"
          type="submit"
          disabled={submitting}
          style={{ backgroundColor: "#2563EB", color: "white" }}
        >
          {submitting ? "Saving..." : initial?.id ? "Update" : "Create"}
        </button>
        <button
          className="note-form-btn"
          type="button"
          disabled={submitting}
          style={{ backgroundColor: "#F9FAFB", color: "#2563EB", border: "1px solid #2563EB" }}
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default NoteForm;

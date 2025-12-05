import React from "react";
import "./NoteList.css";

// PUBLIC_INTERFACE
function NoteList({ notes, onEdit, onDelete, loading }) {
  if (loading) return <div className="note-list-loading">Loading notes...</div>;
  if (!notes.length)
    return <div className="note-list-empty">No notes found. Add a new one!</div>;

  return (
    <div className="note-list-grid">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <div className="note-card-header">
            <h3>{note.title}</h3>
            <div className="note-card-actions">
              <button className="note-edit-btn" onClick={() => onEdit(note)}>
                Edit
              </button>
              <button className="note-delete-btn" onClick={() => onDelete(note)}>
                Delete
              </button>
            </div>
          </div>
          <div className="note-card-content">
            <p>{note.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NoteList;

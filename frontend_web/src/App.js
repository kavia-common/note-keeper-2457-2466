import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import NoteList from "./NoteList";
import NoteForm from "./NoteForm";
import { useNotes } from "./hooks";
import "./App.css";

// PUBLIC_INTERFACE
function OceanNavBar() {
  return (
    <nav className="ocean-navbar">
      <div className="navbar-content">
        <span className="navbar-logo" aria-label="notes logo">📝</span>
        <span className="navbar-title">Note Keeper</span>
      </div>
    </nav>
  );
}

function FloatingAddButton({ onClick }) {
  return (
    <button className="fab-add-note" onClick={onClick} title="Add Note" aria-label="Add Note">
      +
    </button>
  );
}

// PUBLIC_INTERFACE
function AppContent() {
  const {
    notes,
    setNotes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  } = useNotes();

  const [editing, setEditing] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Refresh note list
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // To open edit screen
  const handleEdit = (note) => {
    setEditing(note);
    setShowForm(true);
    navigate("/edit");
  };

  // To open new note dialog
  const handleAdd = () => {
    setEditing(null);
    setShowForm(true);
    navigate("/new");
  };

  // Save create/update note
  const handleSave = async (note) => {
    setFormSubmitting(true);
    if (editing) {
      // Edit
      await updateNote(editing.id, note);
    } else {
      // Create
      await createNote(note);
    }
    setFormSubmitting(false);
    setShowForm(false);
    setEditing(null);
    navigate("/");
  };

  // User cancels form
  const handleCancel = () => {
    setShowForm(false);
    setEditing(null);
    navigate("/");
  };

  // Delete note
  const handleDelete = async (note) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note?\nThis action cannot be undone."
      )
    ) {
      await deleteNote(note.id);
    }
  };

  // Show form on explicit /new or /edit routes
  useEffect(() => {
    if (location.pathname === "/new") {
      setShowForm(true);
      setEditing(null);
    } else if (location.pathname === "/edit" && editing) {
      setShowForm(true);
    } else if (!showForm && (location.pathname === "/new" || location.pathname === "/edit")) {
      // If somehow on form URL but shouldn't show (e.g., delete/cancel), send home
      navigate("/");
    }
    // eslint-disable-next-line
  }, [location.pathname]);

  return (
    <div className="ocean-main">
      <OceanNavBar />
      <main className="ocean-main-content">
        {error && <div className="global-error">{error}</div>}
        <Routes>
          <Route
            path="/"
            element={
              <>
                <NoteList notes={notes} onEdit={handleEdit} onDelete={handleDelete} loading={isLoading} />
                <FloatingAddButton onClick={handleAdd} />
              </>
            }
          />
          <Route
            path="/new"
            element={
              showForm && (
                <NoteForm
                  onSave={handleSave}
                  onCancel={handleCancel}
                  submitting={formSubmitting}
                />
              )
            }
          />
          <Route
            path="/edit"
            element={
              showForm && (
                <NoteForm
                  initial={editing}
                  onSave={handleSave}
                  onCancel={handleCancel}
                  submitting={formSubmitting}
                />
              )
            }
          />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  // Ocean Professional theme (blue, amber), with light/dark support (reused, adapted)
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Keyboard shortcut for dark mode for UX
  useEffect(() => {
    function onKey(e) {
      if (e.key.toLowerCase() === "d" && (e.ctrlKey || e.metaKey)) {
        setTheme((prev) => (prev === "light" ? "dark" : "light"));
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <Router>
      <div className="App">
        <button
          className="theme-toggle"
          onClick={() => setTheme((prev) => (prev === "light" ? "dark" : "light"))}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
        <AppContent />
      </div>
    </Router>
  );
}

export default App;

import { useState, useCallback } from "react";

// Helper to get API base respecting CORS and environment config
const API_BASE =
  process.env.REACT_APP_API_BASE || process.env.REACT_APP_BACKEND_URL || "";

// PUBLIC_INTERFACE
export function useNotes() {
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // PUBLIC_INTERFACE
  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/notes/`);
      if (!res.ok) throw new Error("Failed to fetch notes");
      const data = await res.json();
      setNotes(data);
    } catch (err) {
      setError(err.message || "Error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // PUBLIC_INTERFACE
  const createNote = async (note) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/notes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to create note");
      const data = await res.json();
      setNotes((prev) => [...prev, data]);
      return { success: true };
    } catch (err) {
      setError(err.message || "Error");
      return { success: false };
    }
  };

  // PUBLIC_INTERFACE
  const updateNote = async (id, note) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/notes/${id}/`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(note),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const data = await res.json();
      setNotes((prev) =>
        prev.map((n) => (n.id === data.id ? { ...n, ...data } : n))
      );
      return { success: true };
    } catch (err) {
      setError(err.message || "Error");
      return { success: false };
    }
  };

  // PUBLIC_INTERFACE
  const deleteNote = async (id) => {
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/notes/${id}/`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete note");
      setNotes((prev) => prev.filter((n) => n.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Error");
      return { success: false };
    }
  };

  return {
    notes,
    setNotes,
    isLoading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
  };
}

import { useState } from "react";
import { useNotes } from "./hooks/useNotes";
import { useTheme } from "./context/ThemeContext";

type View = "all" | "pinned" | "archived";

function App() {
  const { theme, toggleTheme } = useTheme();

  const {
    notes,
    pinned,
    archived,
    addNote,
    updateNote,
    removeNote,
    togglePin,
    toggleArchive,
  } = useNotes();

  const [view, setView] = useState<View>("all");
  const [search, setSearch] = useState("");

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [editingId, setEditingId] = useState<number | null>(null);

  function handleSubmit() {
    if (!title.trim() || !content.trim()) {
      window.alert("Please enter both a title and content.");
      return;
    }

    if (editingId !== null) {
      updateNote(editingId, title, content);
      setEditingId(null);
    } else {
      addNote(title, content);
    }

    setTitle("");
    setContent("");
  }

  function handleEdit(id: number) {
    const note = notes.find((note) => note.id === id);

    if (!note) {
      return;
    }

    setTitle(note.title);
    setContent(note.content);
    setEditingId(note.id);
  }

  function handleCancelEdit() {
    setEditingId(null);
    setTitle("");
    setContent("");
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this note?",
    );

    if (confirmed) {
      removeNote(id);
    }
  }

  const viewNotes =
    view === "all"
      ? notes.filter((note) => !note.archived)
      : view === "pinned"
        ? pinned.filter((note) => !note.archived)
        : archived;

  const displayedNotes = viewNotes.filter((note) =>
    `${note.title} ${note.content}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  return (
    <div className={theme}>
      <div className="app-content">
        {/* Header */}
        <header className="app-header">
          <h1>📝 Notes App</h1>

          <button onClick={toggleTheme}>
            {theme === "light" ? "🌙 Dark Mode" : "☀️ Light Mode"}
          </button>
        </header>

        <hr />

        {/* Views */}
        <div className="view-buttons">
          <button
            className={view === "all" ? "active" : ""}
            onClick={() => setView("all")}
          >
            All
          </button>

          <button
            className={view === "pinned" ? "active" : ""}
            onClick={() => setView("pinned")}
          >
            Pinned
          </button>

          <button
            className={view === "archived" ? "active" : ""}
            onClick={() => setView("archived")}
          >
            Archived
          </button>
        </div>

        {/* Search */}
        <div className="search-box">
          <input
            type="text"
            placeholder="🔍 Search notes..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <hr />

        {/* Add / Edit Form */}
        <div className="note-form">
          <h2>{editingId !== null ? "Edit Note" : "Add a Note"}</h2>

          <input
            type="text"
            placeholder="Note title"
            value={title}
            maxLength={60}
            onChange={(event) => setTitle(event.target.value)}
          />

          <p className="character-count">{title.length}/60</p>

          <textarea
            placeholder="Write your note..."
            value={content}
            maxLength={1000}
            onChange={(event) => setContent(event.target.value)}
          />

          <p className="character-count">{content.length}/1000</p>
          <div className="form-actions">
            <button onClick={handleSubmit}>
              {editingId !== null ? "Save Changes" : "Add Note"}
            </button>

            {editingId !== null && (
              <button onClick={handleCancelEdit}>Cancel</button>
            )}
          </div>
        </div>

        <hr />

        {/* Notes Count */}
        <p>
          {view === "all" && `All notes: ${displayedNotes.length}`}

          {view === "pinned" && `Pinned notes: ${displayedNotes.length}`}

          {view === "archived" && `Archived notes: ${displayedNotes.length}`}
        </p>

        {/* Empty State / Notes */}
        {displayedNotes.length === 0 ? (
          <p>
            {search
              ? "No notes match your search."
              : view === "all"
                ? "You don't have any notes yet."
                : view === "pinned"
                  ? "You don't have any pinned notes."
                  : "You don't have any archived notes."}
          </p>
        ) : (
          displayedNotes.map((note) => (
            <div className="note" key={note.id}>
              <h2>{note.title}</h2>

              <p>{note.content}</p>

              {/* Date */}
              <p className="note-date">
                {note.createdAt
                  ? `Created: ${note.createdAt}`
                  : "Date not available"}
              </p>

              <p>{note.pinned ? "📌 Pinned" : "Not pinned"}</p>

              {/* Note Actions */}
              <div className="note-actions">
                <button onClick={() => handleEdit(note.id)}>✏️ Edit</button>

                <button onClick={() => togglePin(note.id)}>
                  {note.pinned ? "📌 Unpin" : "📌 Pin"}
                </button>

                <button onClick={() => toggleArchive(note.id)}>
                  {note.archived ? "📂 Unarchive" : "📦 Archive"}
                </button>

                <button onClick={() => handleDelete(note.id)}>🗑️ Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;

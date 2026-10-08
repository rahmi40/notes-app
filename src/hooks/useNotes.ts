import { useLocalStorage } from "./useLocalStorage";
import type { Note } from "../types/note";

export function useNotes() {
  const [notes, setNotes] = useLocalStorage<Note[]>("notes", []);

  const pinned = notes.filter((note) => note.pinned);

  const archived = notes.filter((note) => note.archived);

  function addNote(title: string, content: string) {
    const newNote: Note = {
      id: Date.now(),
      title,
      content,
      pinned: false,
      archived: false,
      createdAt: new Date().toLocaleString(),
    };

    setNotes((currentNotes) => [...currentNotes, newNote]);
  }

  function updateNote(id: number, title: string, content: string) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              title,
              content,
            }
          : note,
      ),
    );
  }

  function removeNote(id: number) {
    setNotes((currentNotes) => currentNotes.filter((note) => note.id !== id));
  }

  function togglePin(id: number) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              pinned: !note.pinned,
            }
          : note,
      ),
    );
  }

  function toggleArchive(id: number) {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? {
              ...note,
              archived: !note.archived,
            }
          : note,
      ),
    );
  }

  return {
    notes,
    pinned,
    archived,
    addNote,
    updateNote,
    removeNote,
    togglePin,
    toggleArchive,
  };
}

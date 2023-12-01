import { useState, useEffect } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";

const Note = () => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [editingNoteId, setEditingNoteId] = useState("");
  const [editedNoteText, setEditedNoteText] = useState("");

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await axios.get(
        "https://notes-dusky.vercel.app/api/notes"
      );
      setNotes(response.data);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  const handleSave = async () => {
    if (!newNote.trim()) {
      toast.error("Field can not be empty", {
        style: {
          border: "1px solid #dee2e6",
          padding: "8px",
          color: "#888",
        },
        iconTheme: {
          primary: "#dee2e6",
          secondary: "#fff",
        },
      });
      return;
    }
    try {
      const response = await axios.post(
        "https://notes-dusky.vercel.app/api/notes",
        {
          text: newNote,
        }
      );
      toast.success("Note has been saved.", {
        style: {
          border: "1px solid #69db7c",
          padding: "16px",
          color: "#69db7c",
        },
        iconTheme: {
          primary: "#69db7c",
          secondary: "#FFFAEE",
        },
      });
      setNotes([...notes, response.data]);
      setNewNote("");
    } catch (error) {
      console.error("Error saving note:", error);
    }
  };

  const handleEditStart = (id, initialText) => {
    setEditingNoteId(id);
    setEditedNoteText(initialText);
  };

  const handleEditCancel = () => {
    setEditingNoteId("");
    setEditedNoteText("");
  };

  const handleEditSave = async (id) => {
    if (!editedNoteText.trim()) {
      toast.error("Field can not be empty", {
        style: {
          border: "1px solid #dee2e6",
          padding: "8px",
          color: "#888",
        },
        iconTheme: {
          primary: "#dee2e6",
          secondary: "#fff",
        },
      });
      return;
    }
    try {
      const response = await axios.put(
        `https://notes-dusky.vercel.app/api/notes/${id}`,
        { text: editedNoteText }
      );
      setNotes((prevNotes) =>
        prevNotes.map((note) =>
          note._id === id ? { ...note, text: response.data.text } : note
        )
      );
      toast.success("Note has been edited.", {
        style: {
          border: "1px solid #69db7c",
          padding: "16px",
          color: "#69db7c",
        },
        iconTheme: {
          primary: "#69db7c",
          secondary: "#FFFAEE",
        },
      });
      setEditingNoteId("");
      setEditedNoteText("");
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://notes-dusky.vercel.app/api/notes/${id}`);
      setNotes((prevNotes) => prevNotes.filter((note) => note._id !== id));
      toast.error("Note has been Deleted");
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  return (
    <div className="max-w-md sm:max-w-2xl font-golos  mx-auto my-12 flex flex-col justify-center">
      <h1 className="max-w-5xl max-auto flex justify-center bg-gradient-to-t from-blue-400 to-blue-500 font-bold text-4xl text-blue-800">
        Notes
      </h1>
      <div className="bg-blue-200 shadow-lg py-4">
        <p className="ml-4 pt-2">*type your notes here</p>
        <div className="flex">
          <textarea
            type="text"
            className="border-2 p-4 rounded-md m-4 h-12  focus:outline-none"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 px-4 rounded-md font-golos font-semibold  py-2 h-12 mt-4 text-white"
            onClick={handleSave}
          >
            Save
          </button>
          <Toaster />
        </div>
        <ul>
          {notes?.map((note) => (
            <li key={note._id}>
              {editingNoteId === note._id ? (
                <>
                  <input
                    type="text"
                    className="border-2 p-4 rounded-md m-4  h-12  focus:outline-none"
                    value={editedNoteText}
                    onChange={(e) => setEditedNoteText(e.target.value)}
                  />

                  <button
                    className="bg-green-500 px-4 py-2 rounded-md font-extrabold"
                    onClick={() => handleEditSave(note._id)}
                  >
                    Save
                  </button>
                  <button
                    className="bg-red-500 ml-2 px-4 py-2 rounded-md font-extrabold"
                    onClick={handleEditCancel}
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <div className="flex  items-end">
                    <p className="bg-white  ml-4  rounded p-4 mt-2">
                      {note.text}
                    </p>
                    <button
                      className="text-green-500 bg-white  ml-2 px-4 h-8 rounded-md font-extrabold"
                      onClick={() => handleEditStart(note._id, note.text)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500 mr-2 bg-white ml-2 px-4 h-8 rounded-md font-extrabold"
                      onClick={() => handleDelete(note._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Note;

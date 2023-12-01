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
    <div className="max-w-md sm:max-w-2xl font-golos mx-auto  sm:mx-auto my-12 flex flex-col justify-center">
      <h1 className="mx-4 sm:max-auto flex justify-center bg-gradient-to-t from-blue-400 to-blue-500 font-bold text-4xl text-blue-800">
        Notes
      </h1>
      <div className="bg-blue-200 mx-4 shadow-lg py-4">
        <p className="ml-4 pt-2">*type your notes here</p>
        <div className="flex flex-col sm:flex-row">
          <textarea
            type="text"
            className="border-2 p-4 rounded-md m-4 h-12  focus:outline-none"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            required
          />
          <button
            className="bg-blue-500 hover:bg-blue-400 px-4 mx-4 sm:mx-0 rounded-md font-golos font-semibold  py-2 h-12 sm:mt-4 text-white"
            onClick={handleSave}
          >
            Save
          </button>
          <Toaster />
        </div>

        <ul>
          <p className="ml-4 pt-4 font-semibold">*Your notes:</p>
          {notes?.map((note, index) => (
            <li key={note._id}>
              {editingNoteId === note._id ? (
                <>
                  <input
                    type="text"
                    className="border-2 sm:w-none w-40 rounded-md mx-4 my-2 sm:my-0 sm:mt-2  sm:ml-6  p-4 mt-2 focus:outline-none"
                    value={editedNoteText}
                    onChange={(e) => setEditedNoteText(e.target.value)}
                  />

                  <div className="flex gap-x-2 sm:mt-2 ml-4">
                    <button
                      className="bg-green-500 hover:bg-green-400 text-white  sm:ml-2 px-4 h-8 rounded-md font-extrabold "
                      onClick={() => handleEditSave(note._id)}
                    >
                      Save
                    </button>

                    <button
                      className="bg-red-500 hover:bg-red-400 text-white  sm:ml-2 px-4 h-8 rounded-md font-extrabold"
                      onClick={handleEditCancel}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col justify-center  sm:gap-y-0  ">
                    <p className="ml-4 mt-4 w-8 text-center rounded-md bg-blue-400 text-white ">
                      {index + 1}{" "}
                    </p>
                    <p className="bg-white mx-4 my-2 sm:my-0 sm:mt-2  sm:ml-4  rounded p-4 mt-2">
                      {note.text}
                    </p>
                    <div className="flex gap-x-2 sm:mt-2 justify-end">
                      <button
                        className="text-green-500 hover:opacity-80 bg-white sm:ml-2 px-4 h-8 rounded-md font-extrabold"
                        onClick={() => handleEditStart(note._id, note.text)}
                      >
                        Edit
                      </button>
                      <button
                        className="text-red-500 hover:opacity-80 mr-4 bg-white sm:ml-2 px-4 h-8 rounded-md font-extrabold"
                        onClick={() => handleDelete(note._id)}
                      >
                        Delete
                      </button>
                    </div>
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

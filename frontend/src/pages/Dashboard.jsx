import React, { useEffect, useState } from 'react'
import './Dashboard.css'
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {

  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [noteContent, setNoteContent] = useState('')
  const [notes, setNotes] = useState([])
  const [editingId, setEditingId] = useState(null)

  const navigate = useNavigate()

  const token = localStorage.getItem("token")
  const user = jwtDecode(token)

  const username = user.name
  const user_id = user.id

  const data = {
    title: noteTitle,
    content: noteContent,
    user_id: user_id
  }

  // GET NOTES
  const getNotes = async () => {

    try {

      const history = await axios.get(
        `http://localhost:3000/notes/${user_id}`
      )

      setNotes(history.data)

    } catch (err) {

      console.error(err)

    }
  }

  useEffect(() => {
    getNotes()
  }, [])

  // LOGOUT
  async function handleLogout(e) {

    e.preventDefault()

    localStorage.removeItem("token")

    navigate('/')

  }

  // SAVE NOTE
  const saveNote = async () => {

    try {

      // CREATE NOTE
      if (!editingId) {

        await axios.post(
          "http://localhost:3000/notes",
          data
        )

      }

      // UPDATE NOTE
      else {

        await axios.put(
          `http://localhost:3000/notes/${editingId}`,
          data
        )

      }

      await getNotes()

      resetEditor()

    } catch (err) {

      console.error(err)

    }
  }

  // FORM SUBMIT
  async function handleSave(e) {

    e.preventDefault()

    await saveNote()

  }

  // RESET EDITOR
  const resetEditor = () => {

    setNoteTitle('')
    setNoteContent('')
    setEditingId(null)
    setIsEditorOpen(false)

  }

  // ADD NOTE
  const handleAddNote = () => {

    setNoteTitle('')
    setNoteContent('')
    setEditingId(null)
    setIsEditorOpen(true)

  }

  // EDIT NOTE
  const handleEditNote = (note) => {

    setNoteTitle(note.title)
    setNoteContent(note.content)
    setEditingId(note.id)
    setIsEditorOpen(true)

  }

  // DELETE NOTE
  const handleDeleteNote = async (noteId) => {

    try {

      await axios.delete(
        `http://localhost:3000/notes/${noteId}`
      )

      await getNotes()

    } catch (err) {

      console.error(err)

    }
  }

  return (

    <div className="dashboard-page">

      <nav className="dashboard-navbar">

        <div className="dashboard-logo">
          PaperNotes
        </div>

        <div className="dashboard-user">

          <span className="dashboard-username">
            {username}
          </span>

          <button
            className="dashboard-logout"
            type="button"
            onClick={handleLogout}
          >
            Logout
          </button>

        </div>

      </nav>

      <main className="dashboard-content">

        <section className="dashboard-actions">

          <div>

            <h1 className="dashboard-title">
              Your Notes
            </h1>

            <p className="dashboard-subtitle">
              Keep ideas, tasks, and meeting notes organized in one calm workspace.
            </p>

          </div>

          <button
            className="add-note-button"
            type="button"
            onClick={handleAddNote}
          >
            + Add Note
          </button>

        </section>

        {isEditorOpen && (

          <form
            className="note-editor"
            onSubmit={handleSave}
          >

            <div className="note-editor-header">

              <div>

                <h2>
                  {editingId ? 'Edit Note' : 'New Note'}
                </h2>

                <p>
                  Capture details while they are fresh.
                </p>

              </div>

            </div>

            <input
              type="text"
              placeholder="Note title"
              value={noteTitle}
              onChange={(event) =>
                setNoteTitle(event.target.value)
              }
            />

            <textarea
              placeholder="Write your note here..."
              rows={6}
              value={noteContent}
              onChange={(event) =>
                setNoteContent(event.target.value)
              }
            />

            <div className="note-editor-actions">

              <button
                className="note-save"
                type="submit"
              >
                Save
              </button>

              <button
                className="note-cancel"
                type="button"
                onClick={resetEditor}
              >
                Cancel
              </button>

            </div>

          </form>

        )}

        <section className="notes-section">

          <div className="notes-section-header">

            <h2>
              Recent Notes
            </h2>

            <span className="notes-count">
              {notes.length} notes
            </span>

          </div>

          {notes.length === 0 ? (

            <div className="empty-state">

              <div
                className="empty-illustration"
                aria-hidden="true"
              >

                <svg viewBox="0 0 120 90">

                  <rect
                    x="20"
                    y="10"
                    width="80"
                    height="70"
                    rx="10"
                  />

                  <line
                    x1="36"
                    y1="30"
                    x2="84"
                    y2="30"
                  />

                  <line
                    x1="36"
                    y1="44"
                    x2="84"
                    y2="44"
                  />

                  <line
                    x1="36"
                    y1="58"
                    x2="68"
                    y2="58"
                  />

                  <circle
                    cx="88"
                    cy="64"
                    r="10"
                  />

                  <line
                    x1="88"
                    y1="58"
                    x2="88"
                    y2="70"
                  />

                  <line
                    x1="82"
                    y1="64"
                    x2="94"
                    y2="64"
                  />

                </svg>

              </div>

              <h3>No notes yet</h3>

              <p>
                Create your first note to start building your library.
              </p>

            </div>

          ) : (

            <div className="notes-grid">

              {notes.map((note) => (

                <article
                  className="note-card"
                  key={note.id}
                >

                  <div className="note-card-header">

                    <h3>
                      {note.title || 'Untitled note'}
                    </h3>

                    <div className="note-actions">

                      <button
                        type="button"
                        className="icon-button"
                        aria-label="Edit note"
                        onClick={() => handleEditNote(note)}
                      >

                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >

                          <path d="M4 16.5V20h3.5L18 9.5l-3.5-3.5L4 16.5Z" />

                          <path d="M13.5 6l3.5 3.5" />

                        </svg>

                      </button>

                      <button
                        type="button"
                        className="icon-button danger"
                        aria-label="Delete note"
                        onClick={() => handleDeleteNote(note.id)}
                      >

                        <svg
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >

                          <path d="M4 7h16" />

                          <path d="M9 7V5h6v2" />

                          <path d="M7 7l1 12h8l1-12" />

                        </svg>

                      </button>

                    </div>

                  </div>

                  <p className="note-preview">
                    {note.content || 'No content yet. Use the editor to add details.'}
                  </p>

                  <div className="note-meta">
                    {note.createdAt}
                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </main>

    </div>

  )
}

export default Dashboard
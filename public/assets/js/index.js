// Declare the elements.
let notesList
let noteTitle
let noteText
let saveNoteButton
let newNoteButton

// Save the elements (/notes page).
if (window.location.pathname === "/notes") {
  notesList = document.querySelectorAll(".list-container .list-group")
  noteTitle = document.querySelector(".note-title")
  noteText = document.querySelector(".note-textarea")
  saveNoteButton = document.querySelector(".save-note")
  newNoteButton = document.querySelector(".new-note")
}

// Call GET /api/notes and get the notes.
const getAndDisplayNotes = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(displayNotes)

// Display the notes.
async function displayNotes(notes) {
  // Save the notes from the GET /api/notes call.
  let jsonNotes = await notes.json()
  // Clear the notes (/notes page).
  if (window.location.pathname === "/notes") {
    notesList.forEach((element) => (element.innerHTML = ""))
  }
  // Declare an empty notes array.
  let notesListItems = []
  // Create a note list item.
  function createListItem(text, deleteButtonToggle = true) {
    // Create an empty list item.
    const listItem = document.createElement("li")
    listItem.classList.add("list-group-item")
    // Create a note title span and append it to the list item.
    const span = document.createElement("span")
    span.classList.add("list-item-title")
    span.innerText = text
    span.addEventListener("click", handleNoteView)
    listItem.append(span)
    // Create a delete button, add a listener, and append it to the list item.
    if (deleteButtonToggle) {
      const deleteButton = document.createElement("i")
      deleteButton.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      )
      deleteButton.addEventListener("click", handleNoteDelete)
      listItem.append(deleteButton)
    }
    // Return the list item.
    return listItem
  }
  // If there are no saved notes, add a message to the notes array.
  if (jsonNotes.length === 0) {
    notesListItems.push(createListItem("There are no saved notes.", false))
  }
  // For each note, create a list item and push it to the notes array.
  jsonNotes.forEach((note) => {
    const listItem = createListItem(note.title)
    listItem.dataset.note = JSON.stringify(note)
    notesListItems.push(listItem)
  })
  // Append each note from the array to the notes list.
  if (window.location.pathname === "/notes") {
    notesListItems.forEach((note) => notesList[0].append(note))
  }
}





// If note title or text empty, hide save button. Else, show it.
function hideOrShowSaveButton() {
  if (!noteTitle.value.trim() || !noteText.value.trim()) {
    saveNoteButton.style.display = "none"
  } else {
    saveNoteButton.style.display = "inline"
  }
}

// Use the activeNote object to keep track of the note in the textarea.
let activeNote = {}

// 
function renderActiveNote() {
  hide(saveNoteButton)
  if (activeNote.id) {
    noteTitle.setAttribute("readonly", true)
    noteText.setAttribute("readonly", true)
    noteTitle.value = activeNote.title
    noteText.value = activeNote.text
  } else {
    noteTitle.removeAttribute("readonly")
    noteText.removeAttribute("readonly")
    noteTitle.value = ""
    noteText.value = ""
  }
}

function handleNoteSave() {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  }
  saveNote(newNote).then(() => {
    getAndDisplayNotes()
    renderActiveNote()
  })
}

// Call POST /api/notes (would be nice to rewrite as a function)
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })

// Call DELETE /api/notes/:id (would be nice to rewrite as a function)
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

// Delete the clicked note
function handleNoteDelete(e) {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation()

  const note = e.target
  const noteId = JSON.parse(note.parentElement.getAttribute("data-note")).id

  if (activeNote.id === noteId) {
    activeNote = {}
  }

  deleteNote(noteId).then(() => {
    getAndDisplayNotes()
    renderActiveNote()
  })
}

// Sets the activeNote and displays it
function handleNoteView(e) {
  e.preventDefault()
  activeNote = JSON.parse(e.target.parentElement.getAttribute("data-note"))
  renderActiveNote()
}

// Clear the activeNote object and let the user enter a new note.
function handleNewNoteView(e) {
  activeNote = {}
  renderActiveNote()
}

// If on the /notes page, add listeners to the buttons.
if (window.location.pathname === "/notes") {
  noteTitle.addEventListener("keyup", hideOrShowSaveButton)
  noteText.addEventListener("keyup", hideOrShowSaveButton)
  saveNoteButton.addEventListener("click", handleNoteSave)
  newNoteButton.addEventListener("click", handleNewNoteView)
}

getAndDisplayNotes()

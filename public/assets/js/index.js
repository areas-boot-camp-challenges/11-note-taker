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

// Call GET /api/notes, get the notes, and pass them to displayNotes().
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
    span.addEventListener("click", displyayExistingNote)
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
      deleteButton.addEventListener("click", prepareToDeleteNote)
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

// Declare an empty notes object.
let activeNote = {}

// Display active note.
function displayActiveNote() {
  saveNoteButton.style.display = "none"
  // If it’s an existing note, make it read only.
  if (activeNote.title) {
    noteTitle.setAttribute("readonly", true)
    noteText.setAttribute("readonly", true)
    noteTitle.value = activeNote.title
    noteText.value = activeNote.text
  // Else, clear the fields and let the user enter their own values.
  } else {
    noteTitle.removeAttribute("readonly")
    noteText.removeAttribute("readonly")
    noteTitle.value = ""
    noteText.value = ""
  }
}

// Prepare to save note and call saveNote().
function prepareToSaveNote() {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value,
  }
  // Pass the new note to saveNote() and call it.
  saveNote(newNote)
  .then(() => {
    getAndDisplayNotes()
    displayActiveNote()
  })

}

// Call POST /api/notes and save note.
const saveNote = (note) =>
  fetch("/api/notes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(note),
  })

// Display an existing note.
function displyayExistingNote(event) {
  event.preventDefault()
  activeNote = JSON.parse(event.target.parentElement.getAttribute("data-note"))
  displayActiveNote()
}

// Clear the active note and call displayActiveNote().
function clearActiveNote(event) {
  activeNote = {}
  displayActiveNote()
}

// Prepare to delete note and call deleteNote()
function prepareToDeleteNote(event) {
  // Prevent propogation to other listeners.
  event.stopPropagation()
  // Get the note title from the data-note attribute.
  const note = event.target
  const noteTitle = JSON.parse(note.parentElement.getAttribute("data-note")).title
  // If the note is active, clear it.
  if (activeNote.title === noteTitle) {
    activeNote = {}
  }
  // Pass the note title to deleteNote() and call it.
  deleteNote(noteTitle)
  .then(() => {
    getAndDisplayNotes()
    displayActiveNote()
  })

}

// Call DELETE /api/notes/:title and delete note.
const deleteNote = (noteTitle) =>
  fetch(`/api/notes/${noteTitle}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
  })

// Add listeners to the buttons (/notes page).
if (window.location.pathname === "/notes") {
  noteTitle.addEventListener("keyup", hideOrShowSaveButton)
  noteText.addEventListener("keyup", hideOrShowSaveButton)
  saveNoteButton.addEventListener("click", prepareToSaveNote)
  newNoteButton.addEventListener("click", clearActiveNote)
}

getAndDisplayNotes()

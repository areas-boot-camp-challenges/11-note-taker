// Declare elements.
let notesList
let noteTitle
let noteText
let saveNoteButton
let newNoteButton

// If on the /notes pages, define elements.
if (window.location.pathname === "/notes") {
  notesList = document.querySelectorAll(".list-container .list-group")
  noteTitle = document.querySelector(".note-title")
  noteText = document.querySelector(".note-textarea")
  saveNoteButton = document.querySelector(".save-note")
  newNoteButton = document.querySelector(".new-note")
}

// Call GET /api/notes (would be nice to rewrite as a function)
const getAndDisplayNotesList = () =>
  fetch("/api/notes", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
  .then(displayNotesList)

// Display the list of note titles.
const displayNotesList = async (notes) => {
  let jsonNotes = await notes.json()
  if (window.location.pathname === "/notes") {
    notesList.forEach((el) => (el.innerHTML = ""))
  }

  let noteListItems = []

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement("li")
    liEl.classList.add("list-group-item")

    const spanEl = document.createElement("span")
    spanEl.classList.add("list-item-title")
    spanEl.innerText = text
    spanEl.addEventListener("click", handleNoteView)

    liEl.append(spanEl)

    if (delBtn) {
      const delBtnEl = document.createElement("i")
      delBtnEl.classList.add(
        "fas",
        "fa-trash-alt",
        "float-right",
        "text-danger",
        "delete-note"
      )
      delBtnEl.addEventListener("click", handleNoteDelete)

      liEl.append(delBtnEl)
    }

    return liEl
  }

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi("No saved Notes", false))
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title)
    li.dataset.note = JSON.stringify(note)

    noteListItems.push(li)
  })

  if (window.location.pathname === "/notes") {
    noteListItems.forEach((note) => notesList[0].append(note))
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
    getAndDisplayNotesList()
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
    getAndDisplayNotesList()
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

getAndDisplayNotesList()

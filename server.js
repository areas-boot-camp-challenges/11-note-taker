// Requirements: https://courses.bootcampspot.com/courses/2188/assignments/38646?module_item_id=748713.

// Import the Express.js, Path, and File System modules.
const express = require("express")
const path = require("path")
const fs = require("fs")

// Declare app and its port.
const app = express()
const PORT = process.env.PORT || 3333

// Import db.json.
const db = require("./db/db.json")
const { json } = require("express/lib/response")

// Use this middleware to parse JSON and URL-encoded data.
app.use(express.json())
app.use(express.urlencoded({ extended: true })) // ** Do I need this?

// Use this middleware to serve all static files in the public/ folder.
app.use(express.static("public"))

// GET / HTML route (returns index.html).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

// GET /notes HTML route (returns notes.html).
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// GET /api/notes API route (returns notes from db.json).
app.get("/api/notes", (req, res) => {
  res.status(200).json(db)
})

// POST /api/notes API route.
app.post("/api/notes", (req, res) => {
  // Deconstruct the request body.
  const { title, text } = req.body
  // Save the new note or return an error message.
  if (title && text) {
    // Read the db.json file.
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))
    // Use the request to create a new note object.
    const newNote = {
      title,
      text,
    }
    // Push the new note to the notes object.
    notes.push(newNote)
    // Save the new JSON to the db.json file.
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    // Return a success message.
    res.status(201).json(newNote)
  } else {
    // Return an error message.
    res.status(500).json("Oops, something went wrong.")
  }
})

// BONUS: DELETE /api/notes/:title API route.
app.delete("/api/notes/:title", (req, res) => {
  // Save the note title.  
  const noteTitle = req.params.title
  // Delete the note or return an error message.
  if (noteTitle) {
    // Read the db.json file.
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))
    // Delete the note from the notes object.
    let index = notes.findIndex(note => note.title === noteTitle)
    notes.splice(index, 1)
    // Save the new JSON to the db.json file.
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    // Return a success message.
    res.status(204).send("Deleted!") // **
  } else {
    // Return an error message.
    res.status(500).json("Oops, something went wrong.")
  }
})

// Listen at the specified port.
app.listen(PORT, () =>
  console.log(`Available at http://localhost:${PORT}.`)
)

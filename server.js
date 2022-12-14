// Requirements: https://courses.bootcampspot.com/courses/2188/assignments/38646?module_item_id=748713.

// AS A small business owner
// I WANT to be able to write and save notes
// SO THAT I can organize my thoughts and keep track of tasks I need to complete
//
// GIVEN a note-taking application:
// - [x] WHEN I open the Note Taker
//       THEN I am presented with a landing page with a link to a notes page
// - [x] WHEN I click on the link to the notes page
//       THEN I am presented with a page with existing notes listed in the left-hand column, plus empty fields to enter a new note title and the note’s text in the right-hand column
// - [x] WHEN I enter a new note title and the note’s text
//       THEN a Save icon appears in the navigation at the top of the page
// - [ ] WHEN I click on the Save icon
//       THEN the new note I have entered is saved and appears in the left-hand column with the other existing notes
// - [x] WHEN I click on an existing note in the list in the left-hand column
//       THEN that note appears in the right-hand column
// - [x] WHEN I click on the Write icon in the navigation at the top of the page
//       THEN I am presented with empty fields to enter a new note title and the note’s text in the right-hand column

// The application should have a db.json file on the back end that will be used to store and retrieve notes using the fs module.
//
// The following HTML routes should be created:
// - GET /notes should return the notes.html file.
// - GET * should return the index.html file.
//
// The following API routes should be created:
// - GET /api/notes should read the db.json file and return all saved notes as JSON.
// - POST /api/notes should receive a new note to save on the request body, add it to the db.json file, and then return the new note to the client. You'll need to find a way to give each note a unique id when it's saved (look into npm packages that could do this for you).
//
// You haven’t learned how to handle DELETE requests, but this application has that functionality in the front end. As a bonus, see if you can add the DELETE route to the application using the following guideline:
// - DELETE /api/notes/:id should receive a query parameter containing the id of a note to delete. In order to delete a note, you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite the notes to the db.json file.


// Setup //
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


// HTML routes //
// GET / HTML route (returns index.html).
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/index.html"))
})

// GET /notes HTML route (returns notes.html).
app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// API routes //
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

// Listen
// Listen at the specified port.
app.listen(PORT, () =>
  console.log(`Available at http://localhost:${PORT}.`)
)

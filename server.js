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
// - [ ] WHEN I click on an existing note in the list in the left-hand column
//       THEN that note appears in the right-hand column
// - [ ] WHEN I click on the Write icon in the navigation at the top of the page
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

// Use this middleware to parse JSON.
app.use(express.json())

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
  res.json(db)
})

// Declare POST /api/notes API route.
app.post("/api/notes", (req, res) => {
  if (req.body) {
    // Read the db.json file.
    const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))
    // Add the new note to the JSON.
    notes.push(req.body)
    // Save the new JSON to the db.json file.
    fs.writeFileSync("./db/db.json", JSON.stringify(notes))
    // 
    res.redirect("/notes")
  } else {
    // Return an error message.
    res.error("Oops, something went wrong.") // **
  }
})

// BONUS: Declare DELETE /api/notes/:id API route.
app.delete("/api/notes/:id", (req, res) => {
  console.log("DELETE /api/notes/:id API route") // **
  res.end()
})


// Listen at the specified port.
app.listen(PORT, () =>
  console.log(`Available at http://localhost:${PORT}.`)
)

// Requirements: https://courses.bootcampspot.com/courses/2188/assignments/38646?module_item_id=748713.

// Dependencies.
const express = require("express")
const path = require("path")
const fs = require("fs")

// Data.
const db = require("./db/db.json")

// App.
const app = express()
const PORT = process.env.PORT || 3333

// Middleware.
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static("public"))

// Create a unique ID.
const createUniqueId = () => {
	return Math.floor((1 + Math.random()) * 0x10000)
		.toString(16)
		.substring(1)
}

// GET / HTML route (renderHomePage).
app.get("/", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/index.html"))
})

// GET /notes HTML route (renderNotesPage).
app.get("/notes", (req, res) => {
	res.sendFile(path.join(__dirname, "/public/notes.html"))
})

// GET /api/notes API route (getNotes).
app.get("/api/notes", (req, res) => {
	res.status(200).json(db)
})

// POST /api/notes API route (addNote).
app.post("/api/notes", (req, res) => {
	// Deconstruct the request body.
	const { title, text } = req.body
	// Save the new note or return an error message.
	if (title && text) {
		// Read the db.json file.
		const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))
		// Use the request to create a new note object.
		const newNote = {
			id: createUniqueId(),
			title,
			text,
		}
		console.log(newNote) // **
		// Push the new note to the notes object.
		notes.push(newNote)
		// Save the new JSON to the db.json file.
		fs.writeFileSync("./db/db.json", JSON.stringify(notes))
		// Return a success message.
		res.status(201).json(notes)
	} else {
		// Return an error message.
		res.status(500).json("Oops, something went wrong.")
	}
})

// BONUS: DELETE /api/notes/:title API route (deleteNote).
app.delete("/api/notes/:id", (req, res) => {
	// Save the note title.  
	const noteId = req.params.id
	// Delete the note or return an error message.
	if (noteId) {
		// Read the db.json file.
		const notes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"))
		// Delete the note from the notes object.
		let index = notes.findIndex(note => note.id === noteId)
		if (index !== -1) notes.splice(index, 1)
		// Save the new JSON to the db.json file.
		fs.writeFileSync("./db/db.json", JSON.stringify(notes))
		// Return a success message.
		res.status(200).json(notes)
	} else {
		// Return an error message.
		res.status(500).json("Oops, something went wrong.")
	}
})

// Listen at the specified port.
app.listen(PORT, () =>
	console.log(`Available at http://localhost:${PORT}.`),
)

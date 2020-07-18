// Knightmate - an implementation of the chess variant Knightmate (checkmate a Knight rather than a King)
// by Terry Hearst
// Built on (modified) chess.js and chessboard.js

const express = require("express"),
      app = express()

// Make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html
app.use(express.static("public"))

// https://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) =>
{
	response.sendFile(__dirname + "/views/index.html")
})

app.get("/knightmate-offline", (request, response) =>
{
	response.sendFile(__dirname + "/views/knightmate-offline.html")
})

// Listen for requests :)
const listener = app.listen(process.env.PORT || 3000, () =>
{
	console.log("Your app is listening on port " + listener.address().port)
})

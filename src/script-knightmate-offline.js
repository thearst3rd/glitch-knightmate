// Offline chess implementation
// Code borrowed from https://chessboardjs.com/examples#5000

const { Chess } = require("./chess-knightmate")
const { Chessboard } = require("./chessboard")
const $ = require("jquery")

let board = null
const game = new Chess()
const status = $("#status")
//const fen = $("#fen")
//const pgn = $("#pgn")

function onDragStart(source, piece, position, orientation)
{
	// Do not pick up pieces if the game is over
	if (game.game_over())
	{
		return false
	}

	// Only let the current player pick up pieces
	if ((game.turn() === "w" && piece.search(/^b/) !== -1) ||
			(game.turn() === "b" && piece.search(/^w/) !== -1))
	{
		return false
	}

	$('#myBoard .square-55d63').removeClass('highlight1-32417')
	$('#myBoard .square-55d63').removeClass('highlight2-9c5d2')
}

function onDragMove(newLocation, oldLocation, source, piece, position, orientation)
{
	const moves = game.moves(
	{
		square: source,
		verbose: true
	})

	let found = false
	for (let i = 0; i < moves.length; i++)
	{
		if (moves[i].to === newLocation)
		{
			found = true
			break
		}
	}

	if (!found)
		removeDefaultHighlighting();
}

function onDrop(source, target)
{
	// Check if this move is legal
	const move = game.move(
	{
		from: source,
		to: target,
		promotion: 'q' 	// TODO, let player choose promotion
	})

	// If the move is illegal, do not perform
	if (move === null)
		return 'snapback'

	updateStatus()
}

function onSnapEnd()
{
	// Updates the board with changed pieces from castling, en passant, promotion
	board.position(game.fen())
}

function updateStatus()
{
	let statusText = ""

	const moveColor = (game.turn() === "b") ? "Black" : "White"

	if (game.in_checkmate())
	{
		statusText = "GAME OVER: " + moveColor + " is in checkmate."
	}
	else if (game.in_draw())
	{
		statusText = "GAME OVER: Draw"
	}
	else 	// Game still in play
	{
		statusText = moveColor + " to move"
		if (game.in_check())
		{
			statusText += " and in check"
		}
	}

	status.text(statusText)
	//fen.text(game.fen())
	//pgn.text(game.pgn())
}

function removeDefaultHighlighting()
{
	//$("#myBoard .square-55d63").removeClass("highlight1-32417")
	$("#myBoard .square-55d63").removeClass("highlight2-9c5d2")
}

const config =
{
	draggable: true,
	position: game.fen(),
	onDragStart: onDragStart,
	onDragMove: onDragMove,
	onDrop: onDrop,
	onSnapEnd: onSnapEnd,
	pieceTheme: 'img/chesspieces/cburnett-knightmate/{piece}.svg'
}

board = Chessboard("myBoard", config)

updateStatus()

$("#flipButton").on("click", board.flip)

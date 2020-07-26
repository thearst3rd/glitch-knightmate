// Random player chess implementation
// Code borrowed from https://chessboardjs.com/examples#5000

const { Chess } = require("./chess-knightmate")
const { Chessboard } = require("./chessboard")
const $ = require("jquery")

let board = null
let game = new Chess()
const status = $("#status")
const fen = $("#fen")
const pgn = $("#pgn")

let promoting = false
let promotingSource = null
let promotingTarget = null

document.getElementById("myBoard").addEventListener("touchmove", function(e)
{
	e.preventDefault()
}, false)

// Handle promoting pieces
function initPromotion(source, target)
{
	promoting = true
	promotingSource = source
	promotingTarget = target

	$("#promotionSelector").css("display", "inline-block")
	$("#resetButton").prop("disabled", true)

	const turn = game.turn()

	$("#promoteQueen").html("<img src=\"img/chesspieces/cburnett-knightmate/" + turn + "Q.svg\"/>")
	$("#promoteRook").html("<img src=\"img/chesspieces/cburnett-knightmate/" + turn + "R.svg\"/>")
	$("#promoteBishop").html("<img src=\"img/chesspieces/cburnett-knightmate/" + turn + "B.svg\"/>")
	$("#promoteKing").html("<img src=\"img/chesspieces/cburnett-knightmate/" + turn + "K.svg\"/>")
}

function promote(promotingPiece)
{
	const move = game.move({
		from: promotingSource,
		to: promotingTarget,
		promotion: promotingPiece
	})

	if (move === null)
	{
		console.log("Promoting move was invalid!!!")
	}

	promoting = false
	$("#promotionSelector").css("display", "none")
	$("#resetButton").prop("disabled", false)

	finalizeMove()
}

function finalizeMove()
{
	// Updates the board with changed pieces from castling, en passant, promotion
	board.position(game.fen())

	updateStatus()

	if (game.turn() === "b")
	{
		window.setTimeout(makeRandomMove, 250)
		$("#resetButton").prop("disabled", true)
	}
}

function makeRandomMove()
{
	$("#resetButton").prop("disabled", false)

	const possibleMoves = game.moves()

	if (possibleMoves.length === 0)
		return

	const r = Math.floor(Math.random() * possibleMoves.length)
	game.move(possibleMoves[r])
	finalizeMove()
}

$("#promoteQueen").on("click", function() { promote("q") })
$("#promoteRook").on("click", function() { promote("r") })
$("#promoteBishop").on("click", function() { promote("b") })
$("#promoteKing").on("click", function() { promote("k") })

function onDragStart(source, piece, position, orientation)
{
	// Do not pick up pieces if the game is over
	if (game.game_over())
	{
		return false
	}

	// Do not pick up pieces if currently promoting
	if (promoting)
	{
		return false
	}

	// Only let the white player pick up pieces
	if (game.turn() === "w" && piece.search(/^b/) !== -1)
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
	// Check if promotion is required
	if ((game.get(source).type === "p") && (target.charAt(1) == (game.turn() === "b" ? "1" : "8")))
	{
		// Check if move is legal
		const moves = game.moves({ square: source, verbose: true })

		let found = false
		for (let i = 0; i < moves.length; i++)
		{
			const move = moves[i]
			if (move.to === target)
			{
				found = true
				break
			}
		}

		if (!found)
			return "snapback"

		initPromotion(source, target)
	}
	else
	{
		// Check if this move is legal
		const move = game.move(
		{
			from: source,
			to: target,
		})

		// If the move is illegal, do not perform
		if (move === null)
			return "snapback"
	}
}

function onSnapEnd()
{
	if (!promoting)
	{
		finalizeMove()
	}
}

function updateStatus()
{
	let statusText = ""

	if (game.in_checkmate())
	{
		statusText = "GAME OVER: " + ((game.turn() === "b") ? "White" : "Black") + " wins by checkmate."
	}
	else if (game.in_draw())
	{
		statusText = "GAME OVER: Draw"
		if (game.in_stalemate())
			statusText += " by stalemate."
		else if (game.insufficient_material())
			statusText += " by insufficient material."
		else if (game.in_threefold_repetition())
			statusText += " by threefold repetition."
		else
			statusText += "."
	}
	else 	// Game still in play
	{
		statusText = ((game.turn() === "b") ? "Black" : "White") + " to move"
		if (game.in_check())
		{
			statusText += " and in check"
		}
	}

	status.text(statusText)
	fen.text(game.fen())
	pgn.text(game.pgn())
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
$("#resetButton").on("click", function()
{
	const response = confirm("Really reset and start a new game?")

	if (response)
	{
		game = new Chess()
		updateStatus()
		board.position(game.fen())
	}
})

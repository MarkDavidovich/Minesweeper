'use strict'

var gIsUndoAvailable
var gBoards = []

function onUndoClicked(elUndoButton) {
    const currentBoard = undoLastMove()
    gBoard = cloneBoard(currentBoard.board)
    renderBoard(gBoard)
    gGame.lives = currentBoard.lives

    if (gBoards.length === 0) {
        gIsUndoAvailable = false
        elUndoButton.disabled = true
    }
    updateLives()
}

function addBoards(board, lives) {
    var newBoard = { board, lives }
    gBoards.push(newBoard)
}

function undoLastMove() {
    const previousBoard = gBoards.pop()
    return previousBoard
}
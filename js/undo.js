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
    console.log(gGame.lives)
    updateLives()
}

function addBoards(board, lives) {
    var newBoard = { board, lives }
    gBoards.push(newBoard)
    console.log('board pushed!')
    console.log(gBoards)
}

function undoLastMove() {
    const previousBoard = gBoards.pop()


    return previousBoard
}
//Add undo button *
//Create an empty array of objects that contains the cloned boards *
//with each click on a cell, the current board will be pushed into the array along with the lives *
//with a click on undo it will get the last board from the array

//if undo is clicked after the first click, it will return the initial board
//it will check if there are remaining elements in that array and gray out the button if there aren't
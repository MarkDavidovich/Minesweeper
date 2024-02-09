'use strict'

var gHints
var gIsHintActive


function onHintClicked(elHintButton) {

   
    if (!gGame.isOn || gHints === 0) return

    gIsHintActive = !gIsHintActive
    console.log(gIsHintActive)
    if (gIsHintActive) {
        elHintButton.style.backgroundColor = 'blue'
    } else {
        elHintButton.style.backgroundColor = ''
    }
    // const clonedBoard = cloneBoard(gBoard)
    // console.log('clonedBoard', clonedBoard)
    // gIsHintActive = true
    // gHints--
    // console.log('elHintButton', elHintButton)
    

}


function cloneBoard(board) {
    const size = board.length
    const clonedBoard = []

    for (let i = 0; i < size; i++) {
        const row = []
        for (let j = 0; j < board[i].length; j++) {
            const cell = {
                minesAroundCount: board[i][j].minesAroundCount,
                isShown: board[i][j].isShown,
                isMine: board[i][j].isMine,
                isMarked: board[i][j].isMarked
            };
            row.push(cell)
        }
        clonedBoard.push(row)
    }

    return clonedBoard
}
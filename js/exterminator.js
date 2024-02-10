'use strict'

function onExterminateClicked() {
    var mineCells = getMineCells(gBoard)
    console.log('mineCells', mineCells)


    for (let i = 0; i < 3; i++) {
        if (mineCells.length > 0) {
            var randIdx = getRandomIntInclusive(0, mineCells.length - 1)
            var mineCell = mineCells.splice(randIdx, 1)[0]

            gBoard[mineCell.i][mineCell.j].isMine = false
            updateMinesAroundCount(gBoard, mineCell.i, mineCell.j)
        }
    }
    var elExtButton = document.querySelector('.exterminator')
    if (mineCells.length === 0) elExtButton.disabled = true
    renderBoard(gBoard)
}

function updateMinesAroundCount(board, row, col) {
    const size = gLevel.size

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < size && j >= 0 && j < size) {
                if (!board[i][j].isMine) {
                    board[i][j].minesAroundCount = countNeighborsMines(board, i, j)
                }
            }
        }
    }
}
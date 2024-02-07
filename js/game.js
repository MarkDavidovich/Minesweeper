'use strict'
console.log("<------ WORK IN PROGRESS! ------>")
const MINE = '💣'
const FLAG = '🚩'

var gBoard = []
var gLevel = {
    size: 4,
    mines: 2
}
var gGame = {
    isOn: false,
    shownCount: 0,
    markedCount: 0,
    secsPassed: 0,
    lives: 0
}
var gTimerInterval

function onInit() {
    var elWinEmoji = document.querySelector(".reset-button")
    elWinEmoji.innerHTML = '😀'
    clearInterval(gTimerInterval)
    gGame.secsPassed = -1
    updateTimer()

    // gGame.lives = 3
    // updateLives(gGame.lives)
    gGame.markedCount = 0
    gGame.shownCount = 0
    gGame.secsPassed = 0
    gGame.isOn = true
    gBoard = buildBoard()
    renderBoard(gBoard)
}

function buildBoard() {
    const size = gLevel.size
    const board = []

    for (let i = 0; i < size; i++) {
        board.push([])
        for (let j = 0; j < size; j++) {
            var cell = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell

            // if (i === 1 && j === 2 || i === 3 && j === 3) { // hardcoded mines
            //     board[i][j].isMine = true
            // } 

        }
    }

    var minesPlaced = 0
    while (minesPlaced < gLevel.mines) {
        const randRow = getRandomIntInclusive(0, size - 1)
        const randCol = getRandomIntInclusive(0, size - 1)

        if (!board[randRow][randCol].isMine) {
            board[randRow][randCol].isMine = true
            minesPlaced++
        }
    }

    setMinesNegsCount(board)
    return board
}

function renderBoard(board) {
    var strHTML = ''
    for (let i = 0; i < gLevel.size; i++) {
        strHTML += '<tr>'
        for (let j = 0; j < gLevel.size; j++) {
            const currCell = board[i][j]

            if (currCell.isMine) {
                strHTML += `<td class="mine" onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"></td>`
            }
            else {
                strHTML += `<td onclick="onCellClicked(this, ${i}, ${j})" oncontextmenu="onCellRightClicked(event, this, ${i}, ${j})"</td>`
            }
        }
        strHTML += '</tr>'
    }
    const elBoard = document.querySelector('tbody.minefield')
    elBoard.innerHTML = strHTML
}

function onCellClicked(elCell, i, j) {
    if (!gGame.isOn) return

    var cellClicked = gBoard[i][j]

    if (cellClicked.isMarked || cellClicked.isShown) return

    console.log('Cell clicked:', i, j)
    elCell.style.outlineStyle = 'inset'

    if (gGame.shownCount === 0) {
        gTimerInterval = setInterval(updateTimer, 1000)

        while (cellClicked.isMine) { //makes sure the first cell clicked is not a mine
            console.log('FIRST CELL WAS A MINE!')
            gBoard = buildBoard()
            cellClicked = gBoard[i][j]
            // updateLives
        }
    }

    if (cellClicked.isMine === true) {
        elCell.classList.add('explosion')
        elCell.innerHTML = MINE
        checkGameOver(0)
        // updateLives(-1)
    } else {
        cellClicked.isShown = true
        gGame.shownCount++
        elCell.innerHTML = cellClicked.minesAroundCount > 0 ? cellClicked.minesAroundCount : ''
        if (gGame.shownCount === gLevel.size ** 2 - gLevel.mines) checkGameOver(1) // probably need to change this
    }

    if (cellClicked.minesAroundCount === 0) {
        expandNegs(gBoard, elCell, i, j);
    }
    // ADD A CONDITION OF FLAGS TO WIN

}

function onCellRightClicked(event, elCell, i, j) {

    event.preventDefault() // prevent context menu

    if (!gGame.isOn) return

    var cellClicked = gBoard[i][j]

    cellClicked.isMarked = !cellClicked.isMarked

    elCell.innerHTML = cellClicked.isMarked ? FLAG : ''

    if (cellClicked.isMarked && cellClicked.isMine) {
        gGame.markedCount++
        if (gGame.markedCount === gLevel.mines) checkGameOver(1)
    }
    else if (!cellClicked.isMarked && cellClicked.isMine) {
        gGame.markedCount--
    }
    // ADD CONDITION OF SHOWN CELLS TO WIN
}

function checkGameOver(hasWon) {

    gGame.isOn = false
    var message = ''
    clearInterval(gTimerInterval)
    if (hasWon) {
        var elWinEmoji = document.querySelector(".reset-button")
        elWinEmoji.innerHTML = '😎'
        message = "You won!"

    } else {
        var elWinEmoji = document.querySelector(".reset-button")
        elWinEmoji.innerHTML = '😵'
        message = "Boom! you lose..."
        showAllMines()
    }
    console.log(message)

}

function onSetLevel(level, mines) {
    gLevel.size = level
    gLevel.mines = mines
    onInit()
}

function showAllMines() {
    const elMineCells = document.querySelectorAll('.mine')

    for (let i = 0; i < elMineCells.length; i++) {
        const elMineCell = elMineCells[i]
        elMineCell.innerHTML = MINE
        elMineCell.style.outlineStyle = 'inset'
    }
}

function setMinesNegsCount(board) {
    const size = gLevel.size;

    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (!board[i][j].isMine) {
                board[i][j].minesAroundCount = countNeighborsMines(board, i, j)
            }
        }
    }
}

function countNeighborsMines(board, row, col) {
    const size = gLevel.size
    let minesCount = 0

    for (let i = row - 1; i <= row + 1; i++) {
        for (let j = col - 1; j <= col + 1; j++) {
            if (i >= 0 && i < size && j >= 0 && j < size && board[i][j].isMine) {
                minesCount++
            }
        }
    }

    return minesCount
}

function updateTimer() {
    gGame.secsPassed++
    document.querySelector('.timer span').innerText = gGame.secsPassed
}

function expandNegs(board, elCell, cellI, cellJ) {
    for (let i = cellI - 1; i <= cellI + 1; i++) {
        if (i < 0 || i >= board.length) continue
        for (let j = cellJ - 1; j <= cellJ + 1; j++) {
            if (i === cellI && j === cellJ) continue
            if (j < 0 || j >= board[i].length) continue

            const currCell = board[i][j]
            const currElement = document.querySelector(`.minefield tr:nth-child(${i + 1}) td:nth-child(${j + 1})`)

            if (!currCell.isShown && !currCell.isMarked) {
                currElement.style.outlineStyle = 'inset'
                currCell.isShown = true
                gGame.shownCount++

                if (currCell.minesAroundCount === 0) {
                    expandNegs(board, currElement, i, j)
                }
                currElement.innerHTML = currCell.minesAroundCount > 0 ? currCell.minesAroundCount : ''
            }
        }
    }
}

// function updateLives(diff) {
//     console.log('gGame.lives', gGame.lives)
//     gGame.lives += diff
//     var elLives = document.querySelector('.lives span')
//     if (gGame.lives === 2) elLives.innerHTML = '❤️'
//     else if (gGame.lives === 1) elLives.innerHTML = '❤️‍🩹'
//     else if (gGame.lives === 0) {
//         elLives.innerText = '💔'
//         checkGameOver(0)
//     }

// }